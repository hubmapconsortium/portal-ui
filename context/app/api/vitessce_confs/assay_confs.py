import urllib
import re

from vitessce import (
    VitessceConfig,
    MultiImageWrapper,
    OmeTiffWrapper,
    DataType as dt,
    FileType as ft,
    Component as cm,
)

from .utils import (
    _get_matches,
    _exclude_matches,
    _get_path_name,
    _group_by_file_name,
    create_obj_routes,
    on_obj,
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
        full_seqfish_reqex = f"{AssetPaths.IMAGE_PYRAMID_DIR.value}/{AssetPaths.SEQFISH_HYB_CYCLE_REGEX.value}/{AssetPaths.SEQFISH_FILE_REGEX.value}"
        found_images = _get_matches(file_paths_found, full_seqfish_reqex)
        # Get all files grouped by PosN names.
        images_by_pos = _group_by_file_name(found_images)
        confs = []
        # Build up a conf for each Pos.
        for i, images in enumerate(images_by_pos):
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
            conf = vc.to_dict(on_obj=on_obj)
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
    def __init__(self, **kwargs):
        # All "file" Vitessce objects that do not have wrappers.
        self._files = [
            {
                "rel_path": f"{AssetPaths.CODDEX_SPRM_DIR.value}/{AssetPaths.TILE_REGEX.value}.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": f"{AssetPaths.CODDEX_SPRM_DIR.value}/{AssetPaths.TILE_REGEX.value}.cell-sets.json",
                "file_type": ft.CELL_SETS_JSON,
                "data_type": dt.CELL_SETS,
            },
            {
                "rel_path": f"{AssetPaths.CODDEX_SPRM_DIR.value}/{AssetPaths.TILE_REGEX.value}.clusters.json",
                "file_type": "clusters.json",
                "data_type": dt.EXPRESSION_MATRIX,
            },
        ]
        super().__init__(**kwargs)

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
            confs.append(vc.to_dict(on_obj=on_obj))
        self.conf = confs
        return self


class RNASeqConf(ScatterplotViewConf):
    def __init__(self, **kwargs):
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
        super().__init__(**kwargs)


class ATACSeqConf(ScatterplotViewConf):
    def __init__(self, **kwargs):
        # All "file" Vitessce objects that do not have wrappers.
        self._files = [
            {
                "rel_path": f"{AssetPaths.SCATAC_SEQ_DIR.value}/umap_coords_clusters.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": f"{AssetPaths.SCATAC_SEQ_DIR.value}/umap_coords_clusters.cell-sets.json",
                "file_type": ft.CELL_SETS_JSON,
                "data_type": dt.CELL_SETS,
            },
        ]
        super().__init__(**kwargs)


class IMSConf(ImagePyramidViewConf):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Do not show the separated mass-spec images.
        self.image_pyramid_regex = (
            re.escape(AssetPaths.IMAGE_PYRAMID_DIR.value) + r"(?!(/ometiffs/separate/))"
        )


def get_view_config_class_for_data_types(entity, nexus_token):
    data_types = entity["data_types"]
    if Assays.IMAGE_PYRAMID.value in data_types and Assays.SEQFISH.value in data_types:
        return SeqFISHViewConf(
            entity=entity, nexus_token=nexus_token
        ).build_vitessce_conf()
    if (
        Assays.MALDI_IMS_NEG.value in data_types
        or Assays.MALDI_IMS_POS.value in data_types
        and Assays.IMAGE_PYRAMID.value in data_types
    ):
        return IMSConf(entity=entity, nexus_token=nexus_token).build_vitessce_conf()
    if Assays.IMAGE_PYRAMID.value in data_types:
        return ImagePyramidViewConf(
            entity=entity, nexus_token=nexus_token
        ).build_vitessce_conf()
    if Assays.CODEX_CYTOKIT.value in data_types:
        return CytokitSPRMConf(
            entity=entity, nexus_token=nexus_token
        ).build_vitessce_conf()
    if (
        len(
            set(
                [
                    Assays.SCRNA_SEQ_10X.value,
                    Assays.SCRNA_SEQ_SN.value,
                    Assays.SCRNA_SEQ_SCI.value,
                    Assays.SCRNA_SEQ_SNARE.value,
                ]
            ).intersection(data_types)
        )
        != 0
    ):
        return RNASeqConf(entity=entity, nexus_token=nexus_token).build_vitessce_conf()
    if (
        len(
            set(
                [
                    Assays.SCATAC_SEQ_SCI.value,
                    Assays.SCATAC_SEQ_SNARE.value,
                    Assays.SCATAC_SEQ_SN.value,
                ]
            ).intersection(data_types)
        )
        != 0
    ):
        return ATACSeqConf(entity=entity, nexus_token=nexus_token).build_vitessce_conf()
