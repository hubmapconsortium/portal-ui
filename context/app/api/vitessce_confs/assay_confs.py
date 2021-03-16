import re

from vitessce import (
    VitessceConfig,
    MultiImageWrapper,
    OmeTiffWrapper,
    DataType as dt,
    FileType as ft,
)
import requests

from .utils import (
    group_by_file_name,
    get_matches,
)
from .base_confs import (
    ImagingViewConf,
    ScatterplotViewConf,
    ImagePyramidViewConf,
    SPRMViewConf,
    ViewConf
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
    SEQFISH_FILE_REGEX
)
from .type_client import CommonsTypeClient


class SeqFISHViewConf(ImagingViewConf):
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

    def _get_data_json(self):
        url = self._build_assets_url("data.json")
        print(url)
        data_json = requests.get(url).json()
        return data_json
    
    def _get_tile_x_y(self, tile):
        x = int(re.match('X(\d+)', tile)[0].replace('X', ''))
        y = int(re.match('X(\d+)', tile)[0].replace('X', ''))
        return [x, y]


    def build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        found_tiles = get_matches(file_paths_found, TILE_REGEX)
        confs = []
        data_json = self._get_data_json()
        focal_plane_selector = data_json['focal_plane_selector']
        focal_plane_selector_items = focal_plane_selector.items()
        for tile in sorted(found_tiles):
            vc = SPRMViewConf(
                entity=self._entity,
                nexus_token=self._nexus_token,
                is_mock=self._is_mock,
                base_name=tile
            )
            conf = vc.build_vitessce_conf()
            if not self._is_mock:
                [x, y] = self._get_tile_x_y(tile)
                best_z = filter(lambda entry: entry[1]['tile_x'] == x and entry[1]['tile_y'] == y, focal_plane_selector_items)[0]['best_z']
                conf_obj = VitessceConfig.from_dict(conf)
                layers_scope = conf_obj.add_coordination(ct.SPATIAL_LAYERS)
                layers_scope.set_value(
                    {
                        "type": "raster",
                        "channels": [
                            {
                            "selection": {
                                "channel": 0,
                                "time": 0,
                                "z": best_z
                            }
                            },
                            {
                            "selection": {
                                "channel": 1,
                                "time": 0,
                                "z": best_z
                            }
                            },
                            {
                            "selection": {
                                "channel": 2,
                                "time": 0,
                                "z": best_z
                            }
                            },
                            {
                            "selection": {
                                "channel": 3,
                                "time": 0,
                                "z": best_z
                            }
                            }
                        ]
                    }
                )
                conf = conf_obj.to_dict()
            confs.append(conf)
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
