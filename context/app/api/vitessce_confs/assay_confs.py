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
    ViewConf,
    return_empty_json_if_error
)
from .assays import (
    SEQFISH,
    MALDI_IMS_NEG,
    MALDI_IMS_POS,
)
from .paths import (
    SCRNA_SEQ_DIR,
    SCATAC_SEQ_DIR,
    IMAGE_PYRAMID_DIR,
    TILE_REGEX,
    SEQFISH_HYB_CYCLE_REGEX,
    SEQFISH_FILE_REGEX,
    CODEX_TILE_DIR
)
from .type_client import CommonsTypeClient


class SeqFISHViewConf(ImagingViewConf):

    @return_empty_json_if_error
    def build_vitessce_conf(self):
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
            if not self._is_mock:
                current_app.logger.info(message)
            raise FileNotFoundError(f'seqFish assay with uuid {self._uuid} has no matching files')
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
        return confs

    def _get_hybcycle(self, image_path):
        return re.search(SEQFISH_HYB_CYCLE_REGEX, image_path)[0]

    def _get_pos_name(self, image_path):
        return re.search(SEQFISH_FILE_REGEX, image_path)[0].split(".")[
            0
        ]


class CytokitSPRMConf(ViewConf):

    @return_empty_json_if_error
    def build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        found_tiles = get_matches(file_paths_found, TILE_REGEX)
        if len(found_tiles) == 0:
            if not self._is_mock:
                current_app.logger.info(message)
            raise FileNotFoundError(f'Cytokit SPRM assay with uuid {self._uuid} has no matching files')
        confs = []
        for tile in sorted(found_tiles):
            vc = SPRMViewConf(
                entity=self._entity,
                nexus_token=self._nexus_token,
                is_mock=self._is_mock,
                base_name=tile,
                imaging_path=CODEX_TILE_DIR
            )
            confs.append(vc.build_vitessce_conf())
        return confs


class RNASeqConf(ScatterplotViewConf):
    def __init__(self, entity, nexus_token, is_mock=False):
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
    def __init__(self, entity, nexus_token, is_mock=False):
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
    def __init__(self, entity, nexus_token, is_mock=False):
        super().__init__(entity, nexus_token, is_mock)
        # Do not show the separated mass-spec images.
        self.image_pyramid_regex = (
            re.escape(IMAGE_PYRAMID_DIR) + r"(?!/ometiffs/separate/)"
        )


class NullConf():

    @return_empty_json_if_error
    def build_vitessce_conf(self):
        return {}


def get_view_config_class_for_data_types(entity, nexus_token):
    data_types = entity["data_types"]
    tc = CommonsTypeClient()
    assay_objs = [tc.get_assay(dt) for dt in data_types]
    assay_names = [assay.name for assay in assay_objs]
    hints = [hint for assay in assay_objs for hint in assay.vitessce_hints]
    if "is_image" in hints:
        if "codex" in hints:
            return CytokitSPRMConf(
                entity=entity, nexus_token=nexus_token)
        if SEQFISH in assay_names:
            return SeqFISHViewConf(
                entity=entity, nexus_token=nexus_token)
        if (
            MALDI_IMS_NEG in assay_names
            or MALDI_IMS_POS in assay_names
        ):
            return IMSConf(entity=entity, nexus_token=nexus_token)
        return ImagePyramidViewConf(
            entity=entity, nexus_token=nexus_token)
    if "rna" in hints:
        return RNASeqConf(entity=entity, nexus_token=nexus_token)
    if "atac" in hints:
        return ATACSeqConf(entity=entity, nexus_token=nexus_token)
    return NullConf()
