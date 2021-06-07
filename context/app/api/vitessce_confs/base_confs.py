import urllib
from pathlib import Path
import re

from flask import current_app
from vitessce import (
    VitessceConfig,
    MultiImageWrapper,
    OmeTiffWrapper,
    AnnDataWrapper,
    Component as cm,
    DataType as dt,
    FileType as ft,
)

from .utils import get_matches
from .paths import SPRM_JSON_DIR, IMAGE_PYRAMID_DIR, OFFSETS_DIR

MOCK_URL = "https://example.com"


class ViewConfBuilder:
    def __init__(self, entity=None, nexus_token=None, is_mock=False):
        """Object for building the vitessce configuration.

        >>> vc = ViewConfBuilder(entity={"uuid": "uuid"}, nexus_token='nexus_token', is_mock=True)

        """

        self._uuid = entity["uuid"]
        self._nexus_token = nexus_token
        self._entity = entity
        self._is_mock = is_mock
        self._files = []

    def build_vitessce_conf(self):
        "Build a Vitessce view conf and attach to conf attribute"
        pass

    def _replace_url_in_file(self, file):
        """Replace url in incoming file object
        >>> from pprint import pprint
        >>> vc = ViewConfBuilder(entity={"uuid": "uuid"}, nexus_token='nexus_token', is_mock=True)
        >>> file = { 'data_type': 'CELLS', 'file_type': 'cells.json', 'rel_path': 'cells.json' }
        >>> pprint(vc._replace_url_in_file(file))
        {'data_type': 'CELLS',\n\
         'file_type': 'cells.json',\n\
         'url': 'https://example.com/uuid/cells.json?token=nexus_token'}
        """

        return {
            "data_type": file["data_type"],
            "file_type": file["file_type"],
            "url": self._build_assets_url(file["rel_path"]),
        }

    def _build_assets_url(self, rel_path, use_token=True):
        """Create a url for an asset.

        >>> vc = ViewConfBuilder(entity={"uuid": "uuid"}, nexus_token='nexus_token', is_mock=True)
        >>> vc._build_assets_url("rel_path/to/clusters.ome.tiff")
        'https://example.com/uuid/rel_path/to/clusters.ome.tiff?token=nexus_token'

        """
        if not self._is_mock:
            assets_endpoint = current_app.config["ASSETS_ENDPOINT"]
        else:
            assets_endpoint = MOCK_URL
        base_url = urllib.parse.urljoin(assets_endpoint, f"{self._uuid}/{rel_path}")
        token_param = urllib.parse.urlencode({"token": self._nexus_token})
        return f"{base_url}?{token_param}" if use_token else base_url

    def _get_request_init(self):
        request_init = {"headers": {"Authorization": f"Bearer {self._nexus_token}"}}
        # Extra headers outside of a select few cause extra CORS-preflight requests which
        # can slow down the webpage.  If the dataset is published, we don't need to use
        # heaeder to authenticate access to the assets API.
        # See: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests
        use_request_init = False if self._entity["status"] == "Published" else True
        return request_init if use_request_init else None

    def _get_file_paths(self):
        return [file["rel_path"] for file in self._entity["files"]]


class ImagingViewConfBuilder(ViewConfBuilder):
    def _get_img_and_offset_url(self, img_path, img_dir):
        """Create a url for the offsets and img.
        >>> from pprint import pprint
        >>> vc = ImagingViewConfBuilder(entity={ "uuid": "uuid" },\
            nexus_token='nexus_token', is_mock=True)
        >>> pprint(vc._get_img_and_offset_url("rel_path/to/clusters.ome.tiff",\
            "rel_path/to"))
        ('https://example.com/uuid/rel_path/to/clusters.ome.tiff?token=nexus_token',\n\
         'https://example.com/uuid/output_offsets/clusters.offsets.json?token=nexus_token')

        """
        img_url = self._build_assets_url(img_path)
        return (
            img_url,
            str(
                re.sub(
                    r"ome\.tiff?",
                    "offsets.json",
                    re.sub(img_dir, OFFSETS_DIR, img_url),
                )
            ),
        )

    def _setup_view_config_raster(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=9, h=12)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8)
        return vc


class ImagePyramidViewConfBuilder(ImagingViewConfBuilder):
    def __init__(self, entity, nexus_token, is_mock=False):
        self.image_pyramid_regex = IMAGE_PYRAMID_DIR
        super().__init__(entity, nexus_token, is_mock)

    def build_vitessce_conf(self):
        file_paths_found = self._get_file_paths()
        found_images = get_matches(
            file_paths_found, self.image_pyramid_regex + r".*\.ome\.tiff?$",
        )
        if len(found_images) == 0:
            message = (
                f"Image pyramid assay with uuid {self._uuid} has no matching files"
            )
            raise FileNotFoundError(message)

        vc = VitessceConfig(name="HuBMAP Data Portal")
        dataset = vc.add_dataset(name="Visualization Files")
        images = []
        for img_path in found_images:
            img_url, offsets_url = self._get_img_and_offset_url(
                img_path, self.image_pyramid_regex
            )
            images.append(
                OmeTiffWrapper(
                    img_url=img_url, offsets_url=offsets_url, name=Path(img_path).name
                )
            )
        dataset = dataset.add_object(MultiImageWrapper(images))
        vc = self._setup_view_config_raster(vc, dataset)
        conf = vc.to_dict()
        # Don't want to render all layers
        del conf["datasets"][0]["files"][0]["options"]["renderLayers"]
        return conf


class ScatterplotViewConfBuilder(ViewConfBuilder):
    def build_vitessce_conf(self):
        file_paths_expected = [file["rel_path"] for file in self._files]
        file_paths_found = self._get_file_paths()
        # We need to check that the files we expect actually exist.
        # This is due to the volatility of the datasets.
        if not set(file_paths_expected).issubset(set(file_paths_found)):
            message = f'Files for uuid "{self._uuid}" not found as expected.'
            raise FileNotFoundError(message)
        vc = VitessceConfig(name="HuBMAP Data Portal")
        dataset = vc.add_dataset(name="Visualization Files")
        for file in self._files:
            dataset = dataset.add_file(**(self._replace_url_in_file(file)))
        vc = self._setup_scatterplot_view_config(vc, dataset)
        return vc.to_dict()

    def _setup_scatterplot_view_config(self, vc, dataset):
        vc.add_view(dataset, cm.SCATTERPLOT, mapping="UMAP", x=0, y=0, w=9, h=12)
        vc.add_view(dataset, cm.CELL_SETS, x=9, y=0, w=3, h=12)
        return vc


class SPRMViewConfBuilder(ImagePyramidViewConfBuilder):

    def _get_sprm_image(self):
        image_file_regex = f"{self._imaging_path}/{self._base_name}.ome.tiff?"
        file_paths_found = self._get_file_paths()
        found_image_files = get_matches(file_paths_found, image_file_regex)
        if len(found_image_files) != 1:
            message = f'Found {len(found_image_files)} image files for SPRM uuid "{self._uuid}".'
            raise FileNotFoundError(message)
        found_image_file = found_image_files[0]
        return found_image_file

    def _add_sprm_image_to_view_conf(self, found_image_file, vc, dataset):
        img_url, offsets_url = self._get_img_and_offset_url(
            found_image_file, self._imaging_path,
        )
        image_wrapper = OmeTiffWrapper(
            img_url=img_url, offsets_url=offsets_url, name=self._base_name
        )
        dataset = dataset.add_object(image_wrapper)
        return dataset

    def _perpare_vc_and_dataset_with_image(self):
        found_image_file = self._get_sprm_image()
        vc = VitessceConfig(name=self._base_name)
        dataset = vc.add_dataset(name="SPRM")
        dataset = self._add_sprm_image_to_view_conf(found_image_file, vc, dataset)
        return vc, dataset


class SPRMJSONViewConfBuilder(SPRMViewConfBuilder):
    def __init__(self, entity, nexus_token, is_mock=False, **kwargs):
        # All "file" Vitessce objects that do not have wrappers.
        super().__init__(entity, nexus_token, is_mock)
        self._base_name = kwargs["base_name"]
        self._imaging_path = kwargs["imaging_path"]
        self._files = [
            {
                "rel_path": f"{SPRM_JSON_DIR}/" + f"{self._base_name}.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": f"{SPRM_JSON_DIR}/" + f"{self._base_name}.cell-sets.json",
                "file_type": ft.CELL_SETS_JSON,
                "data_type": dt.CELL_SETS,
            },
            {
                "rel_path": f"{SPRM_JSON_DIR}/" + f"{self._base_name}.clusters.json",
                "file_type": "clusters.json",
                "data_type": dt.EXPRESSION_MATRIX,
            },
        ]

    def build_vitessce_conf(self):
        vc, dataset = self._perpare_vc_and_dataset_with_image()
        file_paths_found = self._get_file_paths()
        # This tile has no segmentations
        if self._files[0]["rel_path"] not in file_paths_found:
            vc = self._setup_view_config_raster(vc, dataset)
        else:
            for file in self._files:
                path = file["rel_path"]
                if path not in file_paths_found:
                    message = f'SPRM file {path} with uuid "{self._uuid}" not found as expected.'
                    if not self._is_mock:
                        current_app.logger.error(message)
                    raise FileNotFoundError(message)
                dataset_file = self._replace_url_in_file(file)
                dataset = dataset.add_file(**(dataset_file))
            vc = self._setup_view_config_raster_cellsets_expression_segmentation(
                vc, dataset
            )
        return vc.to_dict()

    def _setup_view_config_raster_cellsets_expression_segmentation(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=7, h=8)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8)
        vc.add_view(dataset, cm.CELL_SETS, x=10, y=5, w=2, h=7)
        vc.add_view(dataset, cm.GENES, x=10, y=0, w=2, h=5).set_props(
            variablesLabelOverride="antigen"
        )
        vc.add_view(dataset, cm.HEATMAP, x=3, y=8, w=7, h=4).set_props(
            transpose=True, variablesLabelOverride="antigen"
        )
        return vc


class SPRMAnnDataViewConfBuilder(SPRMViewConfBuilder):
    def __init__(self, entity, nexus_token, is_mock=False, **kwargs):
        # All "file" Vitessce objects that do not have wrappers.
        super().__init__(entity, nexus_token, is_mock)
        self._base_name = kwargs["base_name"]
        self._imaging_path = f"{self.image_pyramid_regex}/{kwargs['imaging_path']}"

    def build_vitessce_conf(self):
        vc, dataset = self._perpare_vc_and_dataset_with_image()
        file_paths_found = self._get_file_paths()
        zarr_path = f"anndata-zarr/{self._base_name}-anndata.zarr"
        if f"{zarr_path}/.zgroup" not in file_paths_found:
            message = f"SPRM assay with uuid {self._uuid} has no matching .zarr store"
            raise FileNotFoundError(message)
        adata_url = self._build_assets_url(zarr_path, use_token=False)
        anndata_wrapper = AnnDataWrapper(
            adata_url=adata_url,
            spatial_centroid_obsm="xy",
            spatial_polygon_obsm="poly",
            cell_set_obs=[
                "K-Means [Covariance] Expression",
                "K-Means [Mean-All-SubRegions] Expression",
                "K-Means [Mean] Expression",
                "K-Means [Shape-Vectors]",
                "K-Means [Texture]",
                "K-Means [Total] Expression",
            ],
            expression_matrix="X",
            factors_obs=[
                "K-Means [Covariance] Expression",
                "K-Means [Mean-All-SubRegions] Expression",
                "K-Means [Mean] Expression",
                "K-Means [Shape-Vectors]",
                "K-Means [Texture]",
                "K-Means [Total] Expression",
            ],
            request_init=self._get_request_init(),
        )
        dataset = dataset.add_object(anndata_wrapper)
        vc = self._setup_view_config_raster_cellsets_expression_segmentation(
            vc, dataset
        )
        return vc.to_dict()

    def _setup_view_config_raster_cellsets_expression_segmentation(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=7, h=12)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8)
        vc.add_view(dataset, cm.CELL_SETS, x=10, y=5, w=2, h=7)
        vc.add_view(dataset, cm.GENES, x=10, y=0, w=2, h=5).set_props(
            variablesLabelOverride="antigen"
        )
        return vc
