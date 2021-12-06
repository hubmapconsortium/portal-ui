import re

from flask import current_app
from hubmap_commons.type_client import TypeClient
from vitessce import (
    VitessceConfig,
    AnnDataWrapper,
    MultiImageWrapper,
    OmeTiffWrapper,
    DataType as dt,
    FileType as ft,
    Component as cm,
)

from .utils import (
    group_by_file_name,
    get_matches,
)
from .base_confs import (
    AbstractImagingViewConfBuilder,
    AbstractScatterplotViewConfBuilder,
    ImagePyramidViewConfBuilder,
    SPRMJSONViewConfBuilder,
    MultiImageSPRMAnndataViewConfBuilder,
    ViewConfBuilder,
    NullViewConfBuilder,
    ConfCells
)
from .assays import (
    SEQFISH,
    MALDI_IMS
)
from .paths import (
    CELL_DIVE_PYRAMID_DIR,
    CELL_DIVE_REGEX,
    SCRNA_SEQ_DIR,
    SCATAC_SEQ_DIR,
    IMAGE_PYRAMID_DIR,
    TILE_REGEX,
    STITCHED_REGEX,
    SEQFISH_HYB_CYCLE_REGEX,
    SEQFISH_FILE_REGEX,
    CODEX_TILE_DIR,
    STITCHED_IMAGE_DIR
)


class SeqFISHViewConfBuilder(AbstractImagingViewConfBuilder):
    """Wrapper class for generating Vitessce configurations,
    one per position, with the hybridization cycles
    grouped together per position in a single Vitessce configuration.
    """

    def get_conf_cells(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        full_seqfish_reqex = "/".join(
            [
                IMAGE_PYRAMID_DIR,
                SEQFISH_HYB_CYCLE_REGEX,
                SEQFISH_FILE_REGEX
            ]
        )
        found_images = get_matches(file_paths_found, full_seqfish_reqex)
        if len(found_images) == 0:
            message = f'seqFish assay with uuid {self._uuid} has no matching files'
            raise FileNotFoundError(message)
        # Get all files grouped by PosN names.
        images_by_pos = group_by_file_name(found_images)
        confs = []
        # Build up a conf for each Pos.
        for images in images_by_pos:
            image_wrappers = []
            pos_name = self._get_pos_name(images[0])
            vc = VitessceConfig(name=pos_name)
            dataset = vc.add_dataset(name=pos_name)
            sorted_images = sorted(images, key=self._get_hybcycle)
            for img_path in sorted_images:
                img_url, offsets_url = self._get_img_and_offset_url(
                    img_path, IMAGE_PYRAMID_DIR
                )
                image_wrappers.append(
                    OmeTiffWrapper(
                        img_url=img_url,
                        offsets_url=offsets_url,
                        name=self._get_hybcycle(img_path),
                    )
                )
            dataset = dataset.add_object(MultiImageWrapper(image_wrappers))
            vc = self._setup_view_config_raster(
                vc,
                dataset,
                disable_3d=[self._get_hybcycle(img_path) for img_path in sorted_images]
            )
            conf = vc.to_dict()
            # Don't want to render all layers
            del conf["datasets"][0]["files"][0]["options"]["renderLayers"]
            confs.append(conf)
        return ConfCells(confs, None)

    def _get_hybcycle(self, image_path):
        return re.search(SEQFISH_HYB_CYCLE_REGEX, image_path)[0]

    def _get_pos_name(self, image_path):
        return re.search(SEQFISH_FILE_REGEX, image_path)[0].split(".")[
            0
        ]


class CytokitSPRMViewConfigError(Exception):
    """Raised when one of the individual SPRM view configs errors out for Cytokit"""
    pass


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
                is_mock=self._is_mock,
                base_name=tile,
                imaging_path=CODEX_TILE_DIR
            )
            conf = vc.get_conf_cells().conf
            if conf == {}:
                message = f'Cytokit SPRM assay with uuid {self._uuid} has empty view config'
                raise CytokitSPRMViewConfigError(message)
            confs.append(conf)
        return ConfCells(confs, None)


class RNASeqViewConfBuilder(AbstractScatterplotViewConfBuilder):
    """Wrapper class for creating a JSON-backed scatterplot for "first generation" RNA-seq data like
    https://portal.hubmapconsortium.org/browse/dataset/c019a1cd35aab4d2b4a6ff221e92aaab
    from h5ad-to-arrow.cwl (August 2020 release).
    """

    def __init__(self, entity, groups_token, is_mock=False):
        super().__init__(entity, groups_token, is_mock)
        # All "file" Vitessce objects that do not have wrappers.
        self._files = [
            {
                "rel_path": f"{SCRNA_SEQ_DIR}.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": f"{SCRNA_SEQ_DIR}.cell-sets.json",
                "file_type": ft.CELL_SETS_JSON,
                "data_type": dt.CELL_SETS,
            },
        ]


class ATACSeqViewConfBuilder(AbstractScatterplotViewConfBuilder):
    """Wrapper class for creating a JSON-backed scatterplot for "first generation" ATAC-seq data like
    https://portal.hubmapconsortium.org/browse/dataset/d4493657cde29702c5ed73932da5317c
    from h5ad-to-arrow.cwl.
    """

    def __init__(self, entity, groups_token, is_mock=False):
        super().__init__(entity, groups_token, is_mock)
        # All "file" Vitessce objects that do not have wrappers.
        self._files = [
            {
                "rel_path": SCATAC_SEQ_DIR
                + "/umap_coords_clusters.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": SCATAC_SEQ_DIR
                + "/umap_coords_clusters.cell-sets.json",
                "file_type": ft.CELL_SETS_JSON,
                "data_type": dt.CELL_SETS,
            },
        ]


class StitchedCytokitSPRMViewConfBuilder(MultiImageSPRMAnndataViewConfBuilder):
    """Wrapper class for generating multiple "second generation" stitched AnnData-backed SPRM
    Vitessce configurations via SPRMAnnDataViewConfBuilder,
    used for datasets with multiple regions.
    These are from post-August 2020 Cytokit datasets (stitched).
    """

    def __init__(self, entity, groups_token, is_mock=False):
        super().__init__(entity, groups_token, is_mock)
        self._image_id_regex = STITCHED_REGEX
        self._image_pyramid_subdir_regex = STITCHED_IMAGE_DIR
        self._expression_id = 'stitched_expressions'
        self._mask_pyramid_subdir_regex = STITCHED_IMAGE_DIR.replace('expressions', 'mask')
        self._mask_id = 'stitched_mask'

class CellDiveViewConfBuilder(MultiImageSPRMAnndataViewConfBuilder):
    """Wrapper class for generating multiple "second generation" AnnData-backed SPRM
    Vitessce configurations via SPRMAnnDataViewConfBuilder,
    used for Cell DIVE datasets with multiple regions.
    """

    def __init__(self, entity, groups_token, is_mock=False):
        super().__init__(entity, groups_token, is_mock)
        self._image_id_regex = CELL_DIVE_REGEX
        self._expression_id = 'expr'
        self._mask_id = 'mask'
        self._image_pyramid_subdir_regex = CELL_DIVE_PYRAMID_DIR
        self._mask_pyramid_subdir_regex = CELL_DIVE_PYRAMID_DIR.replace(self._expression_id, self._mask_id)


class RNASeqAnnDataZarrViewConfBuilder(ViewConfBuilder):
    """Wrapper class for creating a AnnData-backed view configuration
    for "second generation" post-August 2020 RNA-seq data from anndata-to-ui.cwl like
    https://portal.hubmapconsortium.org/browse/dataset/e65175561b4b17da5352e3837aa0e497
    """

    def __init__(self, entity, groups_token, is_mock=False):
        super().__init__(entity, groups_token, is_mock)
        # Spatially resolved RNA-seq assays require some special handling,
        # and others do not.
        self._is_spatial = False

    def get_conf_cells(self):
        zarr_path = 'hubmap_ui/anndata-zarr/secondary_analysis.zarr'
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        # Use .zgroup file as proxy for whether or not the zarr store is present.
        if f'{zarr_path}/.zgroup' not in file_paths_found:
            message = f'RNA-seq assay with uuid {self._uuid} has no matching .zarr store'
            raise FileNotFoundError(message)
        vc = VitessceConfig(name=self._uuid)
        adata_url = self._build_assets_url(zarr_path, use_token=False)
        # Some of the keys (like marker_genes_for_heatmap) here are from our pipeline
        # https://github.com/hubmapconsortium/portal-containers/blob/master/containers/anndata-to-ui
        # while others come from Matt's standard scanpy pipeline
        # or AnnData default (like X_umap or X).
        cell_set_obs = ["leiden"]
        cell_set_obs_names = ["Leiden"]
        dags = [dag
                for dag in self._entity['metadata']['dag_provenance_list'] if 'name' in dag]
        if(any(['azimuth-annotate' in dag['origin'] for dag in dags])):
            cell_set_obs.append("predicted.ASCT.celltype")
            cell_set_obs_names.append("Predicted ASCT Cell Type")
        dataset = vc.add_dataset(name=self._uuid).add_object(AnnDataWrapper(
            adata_url=adata_url,
            mappings_obsm=["X_umap"],
            mappings_obsm_names=["UMAP"],
            spatial_centroid_obsm=("X_spatial" if self._is_spatial else None),
            cell_set_obs=cell_set_obs,
            cell_set_obs_names=cell_set_obs_names,
            expression_matrix="X",
            matrix_gene_var_filter="marker_genes_for_heatmap",
            factors_obs=[
                "marker_gene_0",
                "marker_gene_1",
                "marker_gene_2",
                "marker_gene_3",
                "marker_gene_4"
            ],
            request_init=self._get_request_init()
        )
        )
        vc = self._setup_anndata_view_config(vc, dataset)
        return ConfCells(vc.to_dict(), None)

    def _setup_anndata_view_config(self, vc, dataset):
        vc.add_view(dataset, cm.SCATTERPLOT, mapping="UMAP", x=0, y=0, w=4, h=6)
        vc.add_view(dataset, cm.CELL_SET_EXPRESSION, x=4, y=0, w=5, h=6)
        vc.add_view(dataset, cm.CELL_SETS, x=9, y=0, w=3, h=3)
        vc.add_view(dataset, cm.GENES, x=9, y=4, w=3, h=3)
        vc.add_view(dataset, cm.HEATMAP, x=0, y=6, w=12, h=4)
        return vc


class SpatialRNASeqAnnDataZarrViewConfBuilder(RNASeqAnnDataZarrViewConfBuilder):
    """Wrapper class for creating a AnnData-backed view configuration
    for "second generation" post-August 2020 spatial RNA-seq data from anndata-to-ui.cwl like
    https://portal.hubmapconsortium.org/browse/dataset/e65175561b4b17da5352e3837aa0e497
    """

    def __init__(self, entity, groups_token, is_mock=False):
        super().__init__(entity, groups_token, is_mock)
        # Spatially resolved RNA-seq assays require some special handling,
        # and others do not.
        self._is_spatial = True

    def _setup_anndata_view_config(self, vc, dataset):
        vc.add_view(dataset, cm.SCATTERPLOT, mapping="UMAP", x=0, y=0, w=4, h=6)
        spatial = vc.add_view(dataset, cm.SPATIAL, x=4, y=0, w=5, h=6)
        [cells_layer] = vc.add_coordination('spatialCellsLayer')
        cells_layer.set_value(
            {
                "visible": True,
                "stroked": False,
                "radius": 20,
                "opacity": 1,
            }
        )
        spatial.use_coordination(cells_layer)
        vc.add_view(dataset, cm.CELL_SETS, x=9, y=0, w=3, h=3)
        vc.add_view(dataset, cm.GENES, x=9, y=4, w=3, h=3)
        vc.add_view(dataset, cm.HEATMAP, x=0, y=6, w=7, h=4)
        vc.add_view(dataset, cm.CELL_SET_EXPRESSION, x=7, y=6, w=5, h=4)
        return vc


class IMSViewConfBuilder(ImagePyramidViewConfBuilder):
    """Wrapper class for generating a Vitessce configurations
    for IMS data that excludes the image pyramids
    of all the channels separated out.
    """

    def __init__(self, entity, groups_token, is_mock=False):
        super().__init__(entity, groups_token, is_mock)
        # Do not show the separated mass-spec images.
        self.image_pyramid_regex = (
            re.escape(IMAGE_PYRAMID_DIR) + r"(?!/ometiffs/separate/)"
        )


_assays = None


def _get_assay(data_type):
    "Return the assay class for the given data type"
    global _assays

    type_client = TypeClient(current_app.config["TYPE_SERVICE_ENDPOINT"])
    if _assays is None:
        # iterAssays does not include deprecated assay names...
        _assays = {assay.name: assay for assay in type_client.iterAssays()}

    if data_type not in _assays:
        # ... but getAssayType does handle deprecated names:
        _assays[data_type] = type_client.getAssayType(data_type)
    return _assays[data_type]


def get_view_config_builder(entity):
    data_types = entity["data_types"]
    assay_objs = [_get_assay(dt) for dt in data_types]
    assay_names = [assay.name for assay in assay_objs]
    hints = [hint for assay in assay_objs for hint in assay.vitessce_hints]
    dag_names = [dag['name']
                 for dag in entity['metadata']['dag_provenance_list'] if 'name' in dag]
    if "is_image" in hints:
        if "celldive_deepcell" in data_types:
            return CellDiveViewConfBuilder
        if "codex" in hints:
            if ('sprm-to-anndata.cwl' in dag_names):
                return StitchedCytokitSPRMViewConfBuilder
            return TiledSPRMViewConfBuilder
        if SEQFISH in assay_names:
            return SeqFISHViewConfBuilder
        if MALDI_IMS in assay_names:
            return IMSViewConfBuilder
        return ImagePyramidViewConfBuilder
    if "rna" in hints:
        # This is the zarr-backed anndata pipeline.
        if "anndata-to-ui.cwl" in dag_names:
            if "salmon_rnaseq_slideseq" in data_types:
                return SpatialRNASeqAnnDataZarrViewConfBuilder
            return RNASeqAnnDataZarrViewConfBuilder
        return RNASeqViewConfBuilder
    if "atac" in hints:
        return ATACSeqViewConfBuilder
    return NullViewConfBuilder
