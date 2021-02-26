import re

from flask import current_app
from vitessce import (
    VitessceConfig,
    MultiImageWrapper,
    OmeTiffWrapper,
    DataType as dt,
    FileType as ft,
)
from hubmap_commons.type_client import TypeClient

from .utils import (
    _group_by_file_name,
    _get_matches,
)
from .base_confs import (
    ImagingViewConf,
    ScatterplotViewConf,
    ImagePyramidViewConf,
    SPRMViewConf,
)
from .constants import (
    Assays,
    AssetPaths,
)


class SeqFISHViewConf(ImagingViewConf):
    def build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        full_seqfish_reqex = (
            f"{AssetPaths.IMAGE_PYRAMID_DIR.value}/"
            + f"{AssetPaths.SEQFISH_HYB_CYCLE_REGEX.value}/"
            + AssetPaths.SEQFISH_FILE_REGEX.value
        )
        found_images = _get_matches(file_paths_found, full_seqfish_reqex)
        # Get all files grouped by PosN names.
        images_by_pos = _group_by_file_name(found_images)
        confs = []
        # Build up a conf for each Pos.
        for images in images_by_pos:
            image_wrappers = []
            vc = VitessceConfig(name=self._get_pos_name(images[0]))
            dataset = vc.add_dataset(name=self._get_pos_name(images[0]))
            for k, img_path in enumerate(sorted(images, key=self._get_hybcycle)):
                img_url, offsets_url = self._get_img_and_offset_url(
                    img_path, AssetPaths.IMAGE_PYRAMID_DIR.value
                )
                image_wrappers += [
                    OmeTiffWrapper(
                        img_url=img_url,
                        offsets_url=offsets_url,
                        name=self._get_hybcycle(img_path),
                    )
                ]
            dataset = dataset.add_object(MultiImageWrapper(image_wrappers))
            vc = self._setup_view_config_raster(vc, dataset)
            conf = vc.to_dict()
            # Don't want to render all layers
            del conf["datasets"][0]["files"][0]["options"]["renderLayers"]
            confs.append(conf)
        self.conf = confs
        return self

    def _get_hybcycle(self, image_path):
        return re.search(AssetPaths.SEQFISH_HYB_CYCLE_REGEX.value, image_path)[0]

    def _get_pos_name(self, image_path):
        return re.search(AssetPaths.SEQFISH_FILE_REGEX.value, image_path)[0].split(".")[
            0
        ]


class CytokitSPRMConf(SPRMViewConf):
    def __init__(self, entity, nexus_token, is_mock):
        # All "file" Vitessce objects that do not have wrappers.
        super().__init__(entity, nexus_token, is_mock)
        self._files = [
            {
                "rel_path": f"{AssetPaths.CODDEX_SPRM_DIR.value}/"
                + f"{AssetPaths.TILE_REGEX.value}.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": f"{AssetPaths.CODDEX_SPRM_DIR.value}/"
                + f"{AssetPaths.TILE_REGEX.value}.cell-sets.json",
                "file_type": ft.CELL_SETS_JSON,
                "data_type": dt.CELL_SETS,
            },
            {
                "rel_path": f"{AssetPaths.CODDEX_SPRM_DIR.value}/"
                + f"{AssetPaths.TILE_REGEX.value}.clusters.json",
                "file_type": "clusters.json",
                "data_type": dt.EXPRESSION_MATRIX,
            },
        ]

    def build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        found_tiles = _get_matches(file_paths_found, AssetPaths.TILE_REGEX.value)
        confs = []
        for index, tile in enumerate(sorted(found_tiles)):
            vc = VitessceConfig(name=tile)
            dataset = vc.add_dataset(name="Cytokit + SPRM")
            img_url, offsets_url = self._get_img_and_offset_url(
                f"{AssetPaths.CODEX_TILE_DIR.value}/{tile}.ome.tiff",
                AssetPaths.CODEX_TILE_DIR.value,
            )
            image_wrapper = OmeTiffWrapper(
                img_url=img_url, offsets_url=offsets_url, name=tile
            )
            dataset = dataset.add_object(image_wrapper)
            # This tile has no segmentations
            if (
                self._files[0]["rel_path"].replace(AssetPaths.TILE_REGEX.value, tile)
                not in file_paths_found
            ):
                vc = self._setup_view_config_raster(vc, dataset)
            else:
                for file in self._files:
                    dataset_file = self._replace_url_in_file(file)
                    dataset_file["url"] = dataset_file["url"].replace(
                        AssetPaths.TILE_REGEX.value, tile
                    )
                    dataset = dataset.add_file(**(dataset_file))
                vc = self._setup_view_config_raster_cellsets_expression_segmentation(
                    vc, dataset
                )
            confs.append(vc.to_dict())
        self.conf = confs
        return self


class RNASeqConf(ScatterplotViewConf):
    def __init__(self, entity, nexus_token, is_mock):
        super().__init__(entity, nexus_token, is_mock)
        # All "file" Vitessce objects that do not have wrappers.
        self._files = [
            {
                "rel_path": f"{AssetPaths.SCRNA_SEQ_DIR.value}.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": f"{AssetPaths.SCRNA_SEQ_DIR.value}.cell-sets.json",
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
                "rel_path": AssetPaths.SCATAC_SEQ_DIR.value
                + "/umap_coords_clusters.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": AssetPaths.SCATAC_SEQ_DIR.value
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
            re.escape(AssetPaths.IMAGE_PYRAMID_DIR.value) + r"(?!(/ometiffs/separate/))"
        )


def get_view_config_class_for_data_types(entity, nexus_token):
    data_types = entity["data_types"]
    tc = TypeClient(current_app.config['TYPE_SERVICE_ENDPOINT'])
    assay_objs = [tc.getAssayType(dt) for dt in data_types]
    assay_names = [assay.name for assay in assay_objs]
    hints = [hint for assay in assay_objs for hint in assay.vitessce_hints]
    if 'is_image' in hints:
        if 'codex' in hints:
            return CytokitSPRMConf(entity=entity, nexus_token=nexus_token)
        if Assays.SEQFISH.value in assay_names:
            return SeqFISHViewConf(entity=entity, nexus_token=nexus_token)
        if (
            Assays.MALDI_IMS_NEG.value in assay_names
            or Assays.MALDI_IMS_POS.value in assay_names
        ):
            return IMSConf(entity=entity, nexus_token=nexus_token)
        return ImagePyramidViewConf(entity=entity, nexus_token=nexus_token)
    if 'rna' in hints:
        return RNASeqConf(entity=entity, nexus_token=nexus_token)
    if 'atac' in hints:
        return ATACSeqConf(entity=entity, nexus_token=nexus_token)
