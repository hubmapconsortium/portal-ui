import urllib
from pathlib import Path
import json
from datauri import DataURI
import re
import copy
from itertools import groupby

from flask import current_app
from hubmap_commons.type_client import TypeClient
from hubmap_commons.singleton_metaclass import SingletonMetaClass

SCATTERPLOT = {
    "version": "0.1.0",
    "layers": [],
    "name": "NAME",
    "staticLayout": [
        {"component": "cellSets", "x": 9, "y": 0, "w": 3, "h": 6},
        {
            "component": "scatterplot",
            "props": {
                # Need to get a better name/way to handle this but for now, this is fine.
                "mapping": "UMAP",
                "view": {"zoom": 4, "target": [0, 0, 0]},
            },
            "x": 0,
            "y": 0,
            "w": 9,
            "h": 6,
        },
    ],
}

TILED_SPRM_IMAGING = {
    "version": "0.1.0",
    "name": "NAME",
    "layers": [],
    "staticLayout": [
        {"component": "layerController", "x": 0, "y": 0, "w": 3, "h": 4},
        {"component": "description", "x": 0, "y": 4, "w": 3, "h": 2},
        {"component": "cellSets", "x": 10, "y": 2, "w": 2, "h": 4},
        {
            "component": "genes",
            "props": {"variablesLabelOverride": "antigen"},
            "x": 10,
            "y": 0,
            "w": 2,
            "h": 2,
        },
        {
            "component": "heatmap",
            "props": {"variablesLabelOverride": "antigen", "transpose": True},
            "x": 3,
            "y": 4,
            "w": 7,
            "h": 2,
        },
        {
            "component": "spatial",
            "props": {"view": {}},
            "x": 3,
            "y": 0,
            "w": 7,
            "h": 4,
        },
    ],
}

TILED_SPRM_IMAGING_ONLY = {
    "version": "0.1.0",
    "name": "NAME",
    "layers": [],
    "staticLayout": [
        {"component": "layerController", "x": 0, "y": 0, "w": 3, "h": 4},
        {"component": "description", "x": 0, "y": 4, "w": 3, "h": 2},
        {
            "component": "spatial",
            "props": {"view": {}},
            "x": 3,
            "y": 0,
            "w": 9,
            "h": 6,
        },
    ],
}

IMAGING_ONLY = {
    "version": "0.1.0",
    "name": "NAME",
    "layers": [],
    "staticLayout": [
        {"component": "layerController", "x": 0, "y": 0, "w": 3, "h": 4},
        {"component": "description", "x": 0, "y": 4, "w": 3, "h": 2},
        {
            "component": "spatial",
            "props": {"view": {}},
            "x": 3,
            "y": 0,
            "w": 9,
            "h": 6,
        },
    ],
}

SCRNA_SEQ_BASE_PATH = "cluster-marker-genes/output/cluster_marker_genes"
SCRNA_SEQ_CONFIG = {
    "base_conf": SCATTERPLOT,
    "files_conf": [
        {
            "rel_path": f"{SCRNA_SEQ_BASE_PATH}.cells.json",
            "fileType": "cells.json",
            "type": "CELLS",
        },
        {
            "rel_path": f"{SCRNA_SEQ_BASE_PATH}.cell-sets.json",
            "fileType": "cell-sets.json",
            "type": "CELL-SETS",
        },
    ],
}

SCATAC_SEQ_BASE_PATH = "output"
SCATAC_SEQ_CONFIG = {
    "base_conf": SCATTERPLOT,
    "files_conf": [
        {
            "rel_path": f"{SCATAC_SEQ_BASE_PATH}/umap_coords_clusters.cells.json",
            "fileType": "cells.json",
            "type": "CELLS",
        },
        {
            "rel_path": f"{SCATAC_SEQ_BASE_PATH}/umap_coords_clusters.cell-sets.json",
            "fileType": "cell-sets.json",
            "type": "CELL-SETS",
        },
    ],
}

CODEX_TILE_PATH = "output/extract/expressions/ome-tiff"
CODDEX_SPRM_PATH = "output_json"
TILE_REGEX = r"R\d+_X\d+_Y\d+"
CODEX_CYTOKIT_CONFIG = {
    "base_conf": TILED_SPRM_IMAGING,
    "view": {"zoom": -1.5, "target": [600, 600, 0]},
    "files_conf": [
        {
            "rel_path": f"{CODEX_TILE_PATH}/{TILE_REGEX}.ome.tiff",
            "fileType": "raster.json",
            "type": "RASTER",
        },
        {
            "rel_path": f"{CODDEX_SPRM_PATH}/{TILE_REGEX}.cells.json",
            "fileType": "cells.json",
            "type": "CELLS",
        },
        {
            "rel_path": f"{CODDEX_SPRM_PATH}/{TILE_REGEX}.cell-sets.json",
            "fileType": "cell-sets.json",
            "type": "CELL-SETS",
        },
        {
            "rel_path": f"{CODDEX_SPRM_PATH}/{TILE_REGEX}.clusters.json",
            "fileType": "clusters.json",
            "type": "EXPRESSION-MATRIX",
        },
    ],
}

IMAGE_PYRAMID_PATH = "ometiff-pyramids"
IMAGE_PYRAMID_CONFIG = {
    "base_conf": IMAGING_ONLY,
    # TODO: We can actually fetch height/width using a COG tiff library,
    # but for now this will do.
    "view": {"zoom": -6.5, "target": [15000, 15000, 0]},
    "files_conf": [
        {
            "rel_path": re.escape(IMAGE_PYRAMID_PATH) + r"/.*\.ome\.tiff?$",
            "fileType": "raster.json",
            "type": "RASTER",
        },
    ],
}

SEQFISH_HYB_CYCLE_REGEX = r"(HybCycle_\d+|final_mRNA_background)"
SEQFISH_NAME_REGEX = r"MMStack_Pos\d+\.ome\.tiff?"
SEQFISH_REGEX = f"{IMAGE_PYRAMID_PATH}/{SEQFISH_HYB_CYCLE_REGEX}/{SEQFISH_NAME_REGEX}"

OFFSETS_PATH = "output_offsets"


class Const(object, metaclass=SingletonMetaClass):
    """
    This class builds some constant data structures based on calls to the type client.  It is a
    singleton, which means only a single instance is ever created, so the tables are built only
    once and reused as needed.
    """
    def __init__(self):
        """
        Initialize the type client and build the required tables, which will be accessed as
        attributes of the singleton instance.
        """
        tc = TypeClient(current_app.config['TYPE_SERVICE_ENDPOINT'])
        conf_lut = {}
        path_lut = {}
        single_cell_list = []
        for assay in tc.iterAssays():
            name = assay.name
            hints = assay.vitessce_hints

            if 'codex' in hints:
                path_lut[name] = {"offsets": OFFSETS_PATH, "image": CODEX_TILE_PATH}
            elif 'pyramid' in hints:
                path_lut[name] = {"offsets": OFFSETS_PATH, "image": IMAGE_PYRAMID_PATH}

            if 'is_sc' in hints:
                single_cell_list.append(name)
                if 'atac' in hints:
                    conf_lut[name] = SCATAC_SEQ_CONFIG
                elif 'rna' in hints:
                    conf_lut[name] = SCRNA_SEQ_CONFIG
            elif 'is_image' in hints:
                if 'pyramid' in hints:
                    conf_lut[name] = IMAGE_PYRAMID_CONFIG
                elif 'codex' in hints:
                    conf_lut[name] = CODEX_CYTOKIT_CONFIG

        self.ASSAY_CONF_LOOKUP = conf_lut
        self.IMAGING_PATHS = path_lut
        self.SC_DATA_TYPES = single_cell_list


MOCK_URL = "https://example.com"


def _get_matches(files, regex):
    return list(
        set(
            [
                match[0]
                for match in set(re.search(regex, file) for file in files)
                if match
            ]
        )
    )


def _exclude_matches(files, regex):
    return list(set(file for file in files if not re.search(regex, file)))


def _get_path_name(file):
    return Path(file).name


def _group_by_file_name(files):
    sorted_files = sorted(files, key=_get_path_name)
    return [list(g) for _, g in groupby(sorted_files, _get_path_name)]


def _get_hybcycle(image):
    return re.search(SEQFISH_HYB_CYCLE_REGEX, image)[0]


class Vitessce:
    def __init__(self, entity=None, nexus_token=None, is_mock=False):
        """Object for building the vitessce configuration.

          >> vitessce = Vitessce(entity, nexus_token)

        """

        # Can there be more than one of these?  This seems like a fine default for now.

        Const()  # Force initialization

        self.assay_type = TypeClient().getAssayType(entity["data_types"][0])
        self.uuid = entity["uuid"]
        self.nexus_token = nexus_token
        self.is_mock = is_mock
        self.entity = entity
        self.conf = {}
        self._build_vitessce_conf()

    def _build_vitessce_conf(self):
        """Vuilding the vitessce configuration.

        >> vitessce = Vitessce(entity, nexus_token)
        >> vitessce.conf

        {
          'name': 'NAME',
          'layers': [
            {
              'name': 'raster',
              'type': 'RASTER',
              'url': DataURI('fjsdlfjasldfa')
            }
          ],
          'staticLayout': [
            {'component': 'layerController', 'x': 0, 'y': 0, 'w': 4, 'h': 6},
            {
                'component': 'spatial',
                'props': {
                    'view': {},
                },
                'x': 4,
                'y': 0,
                'w': 8,
                'h': 6,
            },
          ],
        }

        """
        if self.assay_type.name not in Const().ASSAY_CONF_LOOKUP:
            return {}
        files = copy.deepcopy(Const().ASSAY_CONF_LOOKUP[self.assay_type.name]["files_conf"])
        file_paths_expected = [file["rel_path"] for file in files]
        file_paths_found = [file["rel_path"] for file in self.entity["files"]]
        conf = copy.deepcopy(Const().ASSAY_CONF_LOOKUP[self.assay_type.name]["base_conf"])
        # Codex and other tiled assays needs to be built up based on their input tiles.
        if 'is_image' not in self.assay_type.vitessce_hints:
            # We need to check that the files we expect actually exist.
            # This is due to the volatility of the datasets.
            if not set(file_paths_expected).issubset(set(file_paths_found)):
                if not self.is_mock:
                    current_app.logger.info(
                        f'Files for assay "{self.assay_type.name}" '
                        'uuid "{self.uuid}" not found as expected.'
                    )
                return {}
            layers = [self._build_layer_conf(file) for file in files]
            conf["layers"] = layers
            conf["name"] = self.uuid
            conf = self._replace_view(conf)
            self.conf = conf
            return conf
        elif 'is_tiled' in self.assay_type.vitessce_hints:
            found_tiles = _get_matches(file_paths_found, TILE_REGEX)
            confs = []
            for tile in sorted(found_tiles):
                # If there are no cell segmentations, remove the non-imaging parts of the assay.
                if f"{CODDEX_SPRM_PATH}/{tile}.cell-sets.json" not in file_paths_found:
                    new_conf = copy.deepcopy(TILED_SPRM_IMAGING_ONLY)
                    files_for_layers = [files[0]]
                else:
                    new_conf = copy.deepcopy(conf)
                    files_for_layers = files
                layers = [
                    self._build_layer_conf(file, tile) for file in files_for_layers
                ]
                new_conf["layers"] = layers
                new_conf["name"] = tile
                new_conf = self._replace_view(new_conf)
                confs += [new_conf]
            self.conf = confs
            return confs
        elif 'is_image' in self.assay_type.vitessce_hints:
            found_images = _get_matches(file_paths_found, files[0]["rel_path"])
            # Do not show IMS images that are in the "/separate/" folder.
            no_ims_separate_images = _exclude_matches(found_images, r"/separate/")
            # File paths are like path/to/HybCycle_N/MMStack_PosM.ome.tif and we want
            # each conf to be all images across a given PosM, each image named HybCycle_N.
            # This is unique to seqFish.
            if "seqFish" in self.entity["data_types"]:
                return self._build_seqfish_conf(found_images, conf)
            layers = [self._build_multi_file_image_layer_conf(no_ims_separate_images)]
            conf["layers"] = layers
            conf["name"] = self.uuid
            conf = self._replace_view(conf)
            self.conf = conf
            return conf

    def _build_seqfish_conf(self, found_images, conf):
        is_valid_directory = all([re.fullmatch(SEQFISH_REGEX, file) for file in found_images])
        if not is_valid_directory:
            print(f'Directory structure for seqFish dataset {self.uuid} invalid')
            return []
        # Get all files grouped by PosN names.
        images_by_pos = _group_by_file_name(found_images)
        # Get Hybridization per paths grouped by Pos.
        hyb_cycles_per_pos = [
            sorted([_get_hybcycle(image) for image in images])
            for images in images_by_pos
        ]
        confs = []
        # Build up a conf for each Pos.
        for i, images in enumerate(images_by_pos):
            new_conf = copy.deepcopy(conf)
            layers = [
                self._build_multi_file_image_layer_conf(
                    # Images and hybridization cycles need to be in the same order.
                    sorted(images, key=_get_hybcycle), hyb_cycles_per_pos[i]
                )
            ]
            new_conf["layers"] = layers
            new_conf["name"] = re.search(SEQFISH_NAME_REGEX, images[0])[0].split(".")[0]
            confs.append(self._replace_view(new_conf))
        self.conf = confs
        return confs

    def _build_layer_conf(self, file, tile=""):
        """Build each layer in the layers section.

        returns e.g

        {
          'type': 'CELLS',
          'fileType': 'cells.json',
          'url': 'https://assets.dev.hubmapconsortium.org/uuid/cells.json',
          'name': 'cells'
        }
        """

        return {
            "type": file["type"],
            "fileType": file["fileType"],
            "url": self._build_assets_url(file["rel_path"].replace(TILE_REGEX, tile))
            if file["type"] != "RASTER"
            else self._build_image_layer_datauri(
                [file["rel_path"].replace(TILE_REGEX, tile)]
            ),
            "name": file["type"].lower(),
        }

    def _build_multi_file_image_layer_conf(self, files, names=[]):
        """Build each layer in the layers section.

        returns e.g

        {
          'type': 'RASTER',
          'fileType': 'raster.json',
          'url': 'data:base-64-encoded-string'
          'name': 'raster'
        }
        """
        return {
            "type": "RASTER",
            "fileType": "raster.json",
            "url": self._build_image_layer_datauri(files, names),
            "name": "raster",
        }

    def _build_image_layer_datauri(self, rel_paths, names=[]):
        """
        Specifically for the RASTERS schema, we need to build a DataURI of the schema because
        it contains a URL for a file whose location is unknown until pipelines have been run.

        returns e.g:

        DataURI.make(
          'text/plain',
          charset='us-ascii',
          base64=True,
           data=json.dumps(
             {
               'schema_version': '0.0.1'
               'images': [
                 {
                   'name': 'example.ome.tiff'
                   'type': 'ome-tiff'
                   'url': 'https://assets.dev.hubmapconsortium.org/uuid/example.ome.tiff',
                 }
               ]
             }
            )
        )

        """

        image_layer = {}
        image_layer["images"] = [
            self._build_image_schema(rel_path, names[i] if names else None)
            for i, rel_path in enumerate(rel_paths)
        ]
        image_layer["schemaVersion"] = "0.0.2"
        return DataURI.make(
            "text/plain", charset="us-ascii", base64=True, data=json.dumps(image_layer)
        )

    def _build_image_schema(self, image_rel_path, name=None):
        """
        Builds the 'images' sections of the RASTER schema.

        returns e.g

        {
          'name': 'example.ome.tiff'
          'type': 'ome-tiff'
          'url': 'https://assets.dev.hubmapconsortium.org/uuid/example.ome.tiff',
        }

        """

        schema = {}
        schema["name"] = name if name is not None else Path(image_rel_path).name
        schema["type"] = "ome-tiff"
        schema["url"] = self._build_assets_url(image_rel_path)
        schema["metadata"] = {}
        imaging_paths = Const().IMAGING_PATHS[self.assay_type.name]
        offsets_path = re.sub(
            r"ome\.tiff?$",
            "offsets.json",
            image_rel_path.replace(imaging_paths["image"], imaging_paths["offsets"]),
        )
        schema["metadata"]["omeTiffOffsetsUrl"] = self._build_assets_url(
            str(offsets_path)
        )
        return schema

    def _build_assets_url(self, rel_path):
        """
      Create a url for an asset.

      returns e.g

      'https://assets.dev.hubmapconsortium.org/uuid/rel_path/to/clusters.ome.tiff',

      """
        if not self.is_mock:
            assets_endpoint = current_app.config["ASSETS_ENDPOINT"]
        else:
            assets_endpoint = MOCK_URL
        base_url = urllib.parse.urljoin(assets_endpoint, f"{self.uuid}/{rel_path}")
        token_param = urllib.parse.urlencode({"token": self.nexus_token})
        return base_url + "?" + token_param

    def _replace_view(self, conf):
        """
      Replace the 'view' section of IMAGE_ASSAYS with a reasonable initial view.
      """

        if 'is_image' not in self.assay_type.vitessce_hints:
            return conf
        conf["staticLayout"][-1]["props"]["view"] = copy.deepcopy(
            Const().ASSAY_CONF_LOOKUP[self.assay_type.name]["view"]
        )

        # IMS needs to be zoomed in a bit more,
        # but we don't have a great of finding this assay type:
        # The images are generally smaller but have a lot of padding.

        # IMS images are named under this convention, "IMS_XXXMode".
        # Some of the non IMS images contain the substring "IMS," so that is insufficient.
        # IMC also needs to be handled specially, as does seqFish.
        # TODO: Clean this up by handling multiple assay types (#982).
        if "seqFish" in self.entity["data_types"] or any(
            "IMS_PosMode" in file["rel_path"]
            or "IMS_NegMode" in file["rel_path"]
            or "IMC" in self.entity["data_types"]
            for file in self.entity["files"]
        ):
            conf["staticLayout"][-1]["props"]["view"]["zoom"] = -2
            conf["staticLayout"][-1]["props"]["view"]["target"] = [1000, 1000, 0]
        return conf
