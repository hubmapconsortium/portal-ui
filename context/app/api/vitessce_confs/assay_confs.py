import re

from vitessce import (
    VitessceConfig,
    MultiImageWrapper,
    OmeTiffWrapper,
    DataType as dt,
    FileType as ft,
)

from .utils import (
    group_by_file_name,
    get_matches,
)
from .base_confs import (
    ImagingViewConf,
    ScatterplotViewConf,
    ImagePyramidViewConf,
    SPRMViewConf,
)
from .assays import *
from .paths import *
from .type_client import *

class SeqFISHViewConf(ImagingViewConf):
    def build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        full_seqfish_reqex = "/".join(
            [
                IMAGE_PYRAMID_DIR,
                SEQFISH_HYB_CYCLE_REGEX,
                SEQFISH_FILE_REGEX,
            ]
        )
        found_images = get_matches(file_paths_found, full_seqfish_reqex)
        # Get all files grouped by PosN names.
        images_by_pos = group_by_file_name(found_images)
        confs = []
        # Build up a conf for each Pos.
        for images in images_by_pos:
            image_wrappers = []
            pos_name = self._get_pos_name(images[0])
            vc = VitessceConfig(name=pos_name)
            dataset = vc.add_dataset(name=pos_name)
            for img_path in sorted(images, key=self._get_hybcycle):
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
            vc = self._setup_view_config_raster(vc, dataset)
            conf = vc.to_dict()
            # Don't want to render all layers
            del conf["datasets"][0]["files"][0]["options"]["renderLayers"]
            confs.append(conf)
        self.conf = confs
        return self.conf

    def _get_hybcycle(self, image_path):
        return re.search(SEQFISH_HYB_CYCLE_REGEX, image_path)[0]

    def _get_pos_name(self, image_path):
        return re.search(SEQFISH_FILE_REGEX, image_path)[0].split(".")[
            0
        ]


class CytokitSPRMConf(SPRMViewConf):
    def __init__(self, entity, nexus_token, is_mock):
        # All "file" Vitessce objects that do not have wrappers.
        super().__init__(entity, nexus_token, is_mock)
        self._files = [
            {
                "rel_path": f"{CODEX_SPRM_DIR}/"
                + f"{TILE_REGEX}.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": f"{CODEX_SPRM_DIR}/"
                + f"{TILE_REGEX}.cell-sets.json",
                "file_type": ft.CELL_SETS_JSON,
                "data_type": dt.CELL_SETS,
            },
            {
                "rel_path": f"{CODEX_SPRM_DIR}/"
                + f"{TILE_REGEX}.clusters.json",
                "file_type": "clusters.json",
                "data_type": dt.EXPRESSION_MATRIX,
            },
        ]

    def build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        found_tiles = get_matches(file_paths_found, TILE_REGEX)
        confs = []
        for index, tile in enumerate(sorted(found_tiles)):
            vc = VitessceConfig(name=tile)
            dataset = vc.add_dataset(name="Cytokit + SPRM")
            img_url, offsets_url = self._get_img_and_offset_url(
                f"{CODEX_TILE_DIR}/{tile}.ome.tiff",
                CODEX_TILE_DIR,
            )
            image_wrapper = OmeTiffWrapper(
                img_url=img_url, offsets_url=offsets_url, name=tile
            )
            dataset = dataset.add_object(image_wrapper)
            # This tile has no segmentations
            if (
                self._files[0]["rel_path"].replace(TILE_REGEX, tile)
                not in file_paths_found
            ):
                vc = self._setup_view_config_raster(vc, dataset)
            else:
                for file in self._files:
                    dataset_file = self._replace_url_in_file(file)
                    dataset_file["url"] = dataset_file["url"].replace(
                        TILE_REGEX, tile
                    )
                    dataset = dataset.add_file(**(dataset_file))
                vc = self._setup_view_config_raster_cellsets_expression_segmentation(
                    vc, dataset
                )
            confs.append(vc.to_dict())
        self.conf = confs
        return self.conf


class RNASeqConf(ScatterplotViewConf):
    def __init__(self, entity, nexus_token, is_mock):
        super().__init__(entity, nexus_token, is_mock)
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


class ATACSeqConf(ScatterplotViewConf):
    def __init__(self, entity, nexus_token, is_mock):
        super().__init__(entity, nexus_token, is_mock)
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


class IMSConf(ImagePyramidViewConf):
    def __init__(self, entity, nexus_token, is_mock):
        super().__init__(entity, nexus_token, is_mock)
        # Do not show the separated mass-spec images.
        self.image_pyramid_regex = (
            re.escape(IMAGE_PYRAMID_DIR) + r"(?!/ometiffs/separate/)"
        )


def get_view_config_class_for_data_types(entity, nexus_token):
    data_types = entity["data_types"]
    tc = CommonsTypeClient()
    assay_objs = [tc.get_assay(dt) for dt in data_types]
    assay_names = [assay.name for assay in assay_objs]
    hints = [hint for assay in assay_objs for hint in assay.vitessce_hints]
    if "is_image" in hints:
        if "codex" in hints:
            return CytokitSPRMConf(
                entity=entity, nexus_token=nexus_token, is_mock=False
            )
        if SEQFISH in assay_names:
            return SeqFISHViewConf(
                entity=entity, nexus_token=nexus_token, is_mock=False
            )
        if (
            MALDI_IMS_NEG in assay_names
            or MALDI_IMS_POS in assay_names
        ):
            return IMSConf(entity=entity, nexus_token=nexus_token, is_mock=False)
        return ImagePyramidViewConf(
            entity=entity, nexus_token=nexus_token, is_mock=False
        )
    if "rna" in hints:
        return RNASeqConf(entity=entity, nexus_token=nexus_token, is_mock=False)
    if "atac" in hints:
        return ATACSeqConf(entity=entity, nexus_token=nexus_token, is_mock=False)
