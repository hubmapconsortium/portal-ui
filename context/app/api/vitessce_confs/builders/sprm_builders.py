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

from .base_builders import ConfCells, ViewConfBuilder
from ..utils import get_matches
from ..paths import SPRM_JSON_DIR, STITCHED_REGEX, CODEX_TILE_DIR, TILE_REGEX, STITCHED_IMAGE_DIR
from .imaging_builders import ImagePyramidViewConfBuilder


class CytokitSPRMViewConfigError(Exception):
    """Raised when one of the individual SPRM view configs errors out"""
    pass


class SPRMViewConfBuilder(ImagePyramidViewConfBuilder):
    """Base class with shared methods for different SPRM subclasses,
    like SPRMJSONViewConfBuilder and SPRMAnnDataViewConfBuilder
    https://portal.hubmapconsortium.org/search?mapped_data_types[0]=CODEX%20%5BCytokit%20%2B%20SPRM%5D&entity_type[0]=Dataset
    """

    def _get_full_image_path(self):
        return f"{self._imaging_path_regex}/{self._image_name}.ome.tiff?"

    def _check_sprm_image(self, path_regex):
        """Check whether or not there is a matching SPRM image at a path.
        :param str path_regex: The path to look for the images
        :rtype: str The found image
        """
        file_paths_found = self._get_file_paths()
        found_image_files = get_matches(file_paths_found, path_regex)
        if len(found_image_files) != 1:
            message = f'Found {len(found_image_files)} image files for SPRM uuid "{self._uuid}".'
            raise FileNotFoundError(message)
        found_image_file = found_image_files[0]
        return found_image_file

    def _get_ometiff_image_wrapper(self, found_image_file, found_image_path):
        """Create a OmeTiffWrapper object for an image, including offsets.json after calling
        _get_img_and_offset_url on the arguments to this function.
        :param str found_image_file: The path to look for the image itself
        :param str found_image_path: The folder to be replaced with the offsets path
        """
        img_url, offsets_url = self._get_img_and_offset_url(
            found_image_file, re.escape(found_image_path),
        )
        return OmeTiffWrapper(
            img_url=img_url, offsets_url=offsets_url, name=self._image_name
        )


class SPRMJSONViewConfBuilder(SPRMViewConfBuilder):
    """Wrapper class for generating "first generation" non-stitched JSON-backed
    SPRM Vitessce configurations, like
    https://portal.hubmapconsortium.org/browse/dataset/dc31a6d06daa964299224e9c8d6cafb3
    """

    def __init__(self, entity, groups_token, **kwargs):
        # All "file" Vitessce objects that do not have wrappers.
        super().__init__(entity, groups_token, **kwargs)
        # These are both something like R001_X009_Y009 because
        # there is no mask used here or shared name with the mask data.
        self._base_name = kwargs["base_name"]
        self._image_name = kwargs["base_name"]
        self._imaging_path_regex = kwargs["imaging_path"]
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

    def get_conf_cells(self):
        found_image_file = self._check_sprm_image(self._get_full_image_path())
        vc = VitessceConfig(name=self._base_name)
        dataset = vc.add_dataset(name="SPRM")
        image_wrapper = self._get_ometiff_image_wrapper(found_image_file, self._imaging_path_regex)
        dataset = dataset.add_object(image_wrapper)
        file_paths_found = self._get_file_paths()
        # This tile has no segmentations,
        # so only show Spatial component without cells sets, genes etc.
        if self._files[0]["rel_path"] not in file_paths_found:
            vc = self._setup_view_config_raster(vc, dataset, disable_3d=[self._image_name])
        # This tile has segmentations so show the analysis results.
        else:
            for file in self._files:
                path = file["rel_path"]
                if path not in file_paths_found:
                    message = f'SPRM file {path} with uuid "{self._uuid}" not found as expected.'
                    current_app.logger.error(message)
                    raise FileNotFoundError(message)
                dataset_file = self._replace_url_in_file(file)
                dataset = dataset.add_file(**(dataset_file))
            vc = self._setup_view_config_raster_cellsets_expression_segmentation(
                vc, dataset
            )
        return ConfCells(vc.to_dict(), None)

    def _setup_view_config_raster_cellsets_expression_segmentation(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=7, h=8)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8).set_props(
            disable3d=[self._image_name]
        )
        vc.add_view(dataset, cm.CELL_SETS, x=10, y=5, w=2, h=7)
        vc.add_view(dataset, cm.GENES, x=10, y=0, w=2, h=5).set_props(
            variablesLabelOverride="antigen"
        )
        vc.add_view(dataset, cm.HEATMAP, x=3, y=8, w=7, h=4).set_props(
            transpose=True, variablesLabelOverride="antigen"
        )
        return vc


class SPRMAnnDataViewConfBuilder(SPRMViewConfBuilder):
    """Wrapper class for generating "second generation"
    stitched AnnData-backed SPRM Vitessce configurations,
    like the dataset derived from
    https://portal.hubmapconsortium.org/browse/dataset/1c33472c68c4fb40f531b39bf6310f2d

    :param \\*\\*kwargs: { imaging_path: str, mask_path: str } for the paths
    of the image and mask relative to image_pyramid_regex
    """

    def __init__(self, entity, groups_token, **kwargs):
        super().__init__(entity, groups_token, **kwargs)
        self._base_name = kwargs["base_name"]
        self._mask_name = kwargs["mask_name"]
        self._image_name = kwargs["image_name"]
        self._imaging_path_regex = f"{self.image_pyramid_regex}/{kwargs['imaging_path']}"
        self._mask_path_regex = f"{self.image_pyramid_regex}/{kwargs['mask_path']}"

    def _get_bitmask_image_path(self):
        return f"{self._mask_path_regex}/{self._mask_name}.ome.tiff?"

    def _get_ometiff_mask_wrapper(self, found_bitmask_file):
        bitmask_img_url, bitmask_offsets_url = self._get_img_and_offset_url(
            found_bitmask_file, self.image_pyramid_regex,
        )
        return OmeTiffWrapper(
            img_url=bitmask_img_url,
            offsets_url=bitmask_offsets_url,
            name=self._mask_name,
            is_bitmask=True
        )

    def get_conf_cells(self):
        vc = VitessceConfig(name=self._image_name)
        dataset = vc.add_dataset(name="SPRM")
        file_paths_found = self._get_file_paths()
        zarr_path = f"anndata-zarr/{self._image_name}-anndata.zarr"
        # Use the group as a proxy for presence of the rest of the zarr store.
        if f"{zarr_path}/.zgroup" not in file_paths_found:
            message = f"SPRM assay with uuid {self._uuid} has no matching .zarr store"
            raise FileNotFoundError(message)
        adata_url = self._build_assets_url(zarr_path, use_token=False)
        # https://github.com/hubmapconsortium/portal-containers/blob/master/containers/sprm-to-anndata
        # has information on how these keys are generated.
        obs_keys = [
            "Cell K-Means [tSNE_All_Features]",
            "Cell K-Means [Mean-All-SubRegions] Expression",
            "Cell K-Means [Mean] Expression",
            "Cell K-Means [Shape-Vectors]",
            "Cell K-Means [Texture]",
            "Cell K-Means [Total] Expression",
            "Cell K-Means [Covariance] Expression",
        ]
        anndata_wrapper = AnnDataWrapper(
            mappings_obsm=["tsne"],
            mappings_obsm_names=["t-SNE"],
            adata_url=adata_url,
            spatial_centroid_obsm="xy",
            cell_set_obs=obs_keys,
            expression_matrix="X",
            factors_obs=obs_keys,
            request_init=self._get_request_init(),
        )
        dataset = dataset.add_object(anndata_wrapper)
        found_image_file = self._check_sprm_image(self._get_full_image_path())
        image_wrapper = self._get_ometiff_image_wrapper(found_image_file, self.image_pyramid_regex)
        found_bitmask_file = self._check_sprm_image(self._get_bitmask_image_path())
        bitmask_wrapper = self._get_ometiff_mask_wrapper(found_bitmask_file)
        dataset = dataset.add_object(MultiImageWrapper([image_wrapper, bitmask_wrapper]))
        vc = self._setup_view_config_raster_cellsets_expression_segmentation(
            vc, dataset
        )
        return ConfCells(vc.to_dict(), None)

    def _setup_view_config_raster_cellsets_expression_segmentation(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=4, h=8)
        vc.add_view(dataset, cm.SCATTERPLOT, mapping="t-SNE", x=7, y=0, w=3, h=8)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8)
        vc.add_view(dataset, cm.CELL_SETS, x=10, y=5, w=2, h=7)
        vc.add_view(dataset, cm.GENES, x=10, y=0, w=2, h=5).set_props(
            variablesLabelOverride="antigen"
        )
        vc.add_view(dataset, cm.HEATMAP, x=3, y=8, w=7, h=4).set_props(
            variablesLabelOverride="antigen", transpose=True
        )
        return vc


class StitchedCytokitSPRMViewConfBuilder(ViewConfBuilder):
    """Wrapper class for generating multiple "second generation" stitched AnnData-backed SPRM
    Vitessce configurations via SPRMAnnDataViewConfBuilder,
    used for datasets with multiple regions.
    These are from post-August 2020 Cytokit datasets (stitched).
    """

    def get_conf_cells(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        found_regions = get_matches(file_paths_found, STITCHED_REGEX)
        if len(found_regions) == 0:
            raise FileNotFoundError(
                f"Cytokit SPRM assay with uuid {self._uuid} has no matching regions; "
                f"No file matches for '{STITCHED_REGEX}'."
            )
        confs = []
        for region in sorted(found_regions):
            vc = SPRMAnnDataViewConfBuilder(
                entity=self._entity,
                groups_token=self._groups_token,
                base_name=region,
                imaging_path=STITCHED_IMAGE_DIR,
                mask_path=STITCHED_IMAGE_DIR.replace('expressions', 'mask'),
                image_name=f"{region}_stitched_expressions",
                mask_name=f"{region}_stitched_mask"
            )
            conf = vc.get_conf_cells().conf
            if conf == {}:
                raise CytokitSPRMViewConfigError(
                    f"Cytokit SPRM assay with uuid {self._uuid} has empty view\
                        config for region '{region}'"
                )
            confs.append(conf)
        return ConfCells(confs if len(confs) > 1 else confs[0], None)


class TiledSPRMViewConfBuilder(ViewConfBuilder):
    """Wrapper class for generating many "first generation"
    non-stitched JSON-backed SPRM Vitessce configurations,
    one per tile per region, via SPRMJSONViewConfBuilder.
    """

    def get_conf_cells(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        found_tiles = get_matches(
            file_paths_found,
            TILE_REGEX) or get_matches(
            file_paths_found,
            STITCHED_REGEX)
        if len(found_tiles) == 0:
            message = f'Cytokit SPRM assay with uuid {self._uuid} has no matching tiles'
            raise FileNotFoundError(message)
        confs = []
        for tile in sorted(found_tiles):
            vc = SPRMJSONViewConfBuilder(
                entity=self._entity,
                groups_token=self._groups_token,
                base_name=tile,
                imaging_path=CODEX_TILE_DIR
            )
            conf = vc.get_conf_cells().conf
            if conf == {}:
                message = f'Cytokit SPRM assay with uuid {self._uuid} has empty view config'
                raise CytokitSPRMViewConfigError(message)
            confs.append(conf)
        return ConfCells(confs, None)
