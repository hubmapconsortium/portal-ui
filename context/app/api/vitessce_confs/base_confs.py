import urllib
from pathlib import Path
import re

from flask import current_app
from vitessce import (
    VitessceConfig,
    MultiImageWrapper,
    OmeTiffWrapper,
    Component as cm,
)

from .utils import get_matches
from .constants import AssetPaths

MOCK_URL = "https://example.com"


class ViewConf:
    def __init__(self, entity=None, nexus_token=None, is_mock=False):
        """Object for building the vitessce configuration.

        >>> vc = ViewConf(entity={ "uuid": "uuid" }, nexus_token='nexus_token', is_mock=True)

        """

        # Can there be more than one of these?  This seems like a fine default for now.
        self.conf = {}
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

        >>> vc = ViewConf(entity={ "uuid": "uuid" }, nexus_token='nexus_token', is_mock=True)
        >>> file = { 'data_type': 'CELLS', 'file_type': 'cells.json', 'rel_path': 'cells.json' }
        >>> vc._replace_url_in_file(file)
        {'data_type': 'CELLS', 'file_type': 'cells.json', 'url': 'https://example.com/uuid/cells.json?token=nexus_token'}
        """

        return {
            "data_type": file["data_type"],
            "file_type": file["file_type"],
            "url": self._build_assets_url(file["rel_path"]),
        }

    def _build_assets_url(self, rel_path):
        """Create a url for an asset.

        >>> vc = ViewConf(entity={ "uuid": "uuid" }, nexus_token='nexus_token', is_mock=True)
        >>> vc._build_assets_url("rel_path/to/clusters.ome.tiff")
        'https://example.com/uuid/rel_path/to/clusters.ome.tiff?token=nexus_token'

        """
        if not self._is_mock:
            assets_endpoint = current_app.config["ASSETS_ENDPOINT"]
        else:
            assets_endpoint = MOCK_URL
        base_url = urllib.parse.urljoin(assets_endpoint, f"{self._uuid}/{rel_path}")
        token_param = urllib.parse.urlencode({"token": self._nexus_token})
        return base_url + "?" + token_param


class ImagingViewConf(ViewConf):
    def _get_img_and_offset_url(self, img_path, img_dir):
        """Create a url for the offsets and img.
        >>> vc = ImagingViewConf(entity={ "uuid": "uuid" },\
            nexus_token='nexus_token', is_mock=True)
        >>> vc._get_img_and_offset_url("rel_path/to/clusters.ome.tiff", "rel_path/to")
        ('https://example.com/uuid/rel_path/to/clusters.ome.tiff?token=nexus_token', 'https://example.com/uuid/output_offsets/clusters.offsets.json?token=nexus_token')

        """
        img_url = self._build_assets_url(img_path)
        return (
            img_url,
            str(
                re.sub(
                    r"ome\.tiff?",
                    "offsets.json",
                    re.sub(img_dir, AssetPaths.OFFSETS_DIR.value, img_url),
                )
            ),
        )

    def _setup_view_config_raster(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=9, h=12)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8)
        return vc


class ImagePyramidViewConf(ImagingViewConf):
    def __init__(self, entity, nexus_token, is_mock):
        self.image_pyramid_regex = AssetPaths.IMAGE_PYRAMID_DIR.value
        super().__init__(entity, nexus_token, is_mock)

    def build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        found_images = get_matches(
            file_paths_found, self.image_pyramid_regex + r".*\.ome\.tiff?$",
        )
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
        self.conf = vc.to_dict()
        # Don't want to render all layers
        del self.conf["datasets"][0]["files"][0]["options"]["renderLayers"]
        return self


class ScatterplotViewConf(ViewConf):
    def build_vitessce_conf(self):
        file_paths_expected = [file["rel_path"] for file in self._files]
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        # We need to check that the files we expect actually exist.
        # This is due to the volatility of the datasets.
        if not set(file_paths_expected).issubset(set(file_paths_found)):
            if not self._is_mock:
                current_app.logger.info(
                    f'Files for uuid "{self._uuid}" not found as expected.'
                )
            return self
        vc = VitessceConfig(name="HuBMAP Data Portal")
        dataset = vc.add_dataset(name="Visualization Files")
        for file in self._files:
            dataset = dataset.add_file(**(self._replace_url_in_file(file)))
        vc = self._setup_scatterplot_view_config(vc, dataset)
        self.conf = vc.to_dict()
        return self

    def _setup_scatterplot_view_config(self, vc, dataset):
        vc.add_view(dataset, cm.SCATTERPLOT, mapping="UMAP", x=0, y=0, w=9, h=12)
        vc.add_view(dataset, cm.CELL_SETS, x=9, y=0, w=3, h=12)
        return vc


class SPRMViewConf(ImagingViewConf):
    def _setup_view_config_raster_cellsets_expression_segmentation(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=7, h=8)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8)
        vc.add_view(dataset, cm.CELL_SETS, x=10, y=6, w=2, h=6)
        vc.add_view(dataset, cm.GENES, x=10, y=0, w=2, h=6)
        vc.add_view(dataset, cm.HEATMAP, x=3, y=8, w=7, h=4)
        return vc
