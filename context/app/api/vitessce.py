import urllib
from pathlib import Path
import json
from datauri import DataURI
import re
import copy

from flask import current_app

# TODO: Only for Demo! #

# Hardcoded CODEX offsets and tile path.
CODEX_OFFSETS_PATH = "output_offsets"
CODEX_TILE_PATH = "output/extract/expressions/ome-tiff"
CODDEX_SPRM_PATH = "output_json"

# END: Only for Demo! #

SCRNASEQ_BASE_PATH = "cluster-marker-genes/output/cluster_marker_genes"

SCATTERPLOT = {
    "layers": [],
    "name": "NAME",
    "staticLayout": [
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
        {"component": "cellSets", "x": 9, "y": 0, "w": 3, "h": 6},
    ],
}

IMAGING = {
    "name": "NAME",
    "layers": [],
    "staticLayout": [
        {"component": "layerController", "x": 0, "y": 0, "w": 4, "h": 4},
        {"component": "description", "x": 0, "y": 4, "w": 4, "h": 2},
        {
            "component": "spatial",
            "props": {"view": {}},
            "x": 4,
            "y": 0,
            "w": 6,
            "h": 4,
        },
        {"component": "cellSets", "x": 10, "y": 2, "w": 2, "h": 2},
        {"component": "genes", "x": 10, "y": 0, "w": 2, "h": 2},
        {"component": "heatmap", "x": 4, "y": 4, "w": 8, "h": 2},
    ],
}


ASSAY_CONF_LOOKUP = {
    "salmon_rnaseq_10x": {
        "base_conf": SCATTERPLOT,
        "files_conf": [
            {"rel_path": f"{SCRNASEQ_BASE_PATH}.cells.json", "type": "CELLS"},
            {"rel_path": f"{SCRNASEQ_BASE_PATH}.cell-sets.json", "type": "CELL-SETS"},
        ],
    },
    "codex_cytokit": {
        "base_conf": IMAGING,
        "view": {"zoom": -1.5, "target": [600, 600, 0]},
        "files_conf": [
            # Hardcoded for now only one tile.
            {
                "rel_path": str(Path(CODEX_TILE_PATH) / "#TILE#.ome.tiff"),
                "type": "RASTER",
            },
            {
                "rel_path": str(Path(CODDEX_SPRM_PATH) / "#TILE#.cells.json"),
                "type": "CELLS",
            },
            {
                "rel_path": str(Path(CODDEX_SPRM_PATH) / "#TILE#.cell-sets.json"),
                "type": "CELL-SETS",
            },
            {
                "rel_path": str(Path(CODDEX_SPRM_PATH) / "#TILE#.genes.json"),
                "type": "GENES",
            },
            {
                "rel_path": str(Path(CODDEX_SPRM_PATH) / "#TILE#.clusters.json"),
                "type": "CLUSTERS",
            },
        ],
    },
}

CODEX_ASSAY = "codex_cytokit"

IMAGE_ASSAYS = [CODEX_ASSAY]
TILED_ASSAYS = [CODEX_ASSAY]

TILE_REGEX = ".*(R(\\d+)_X(\\d+)_Y(\\d+)).*"

MOCK_URL = "https://example.com"


def _get_tiles(files):
    return list(
        set(
            [
                re.match(TILE_REGEX, file).group(1)
                for file in files
                if re.match(TILE_REGEX, file)
            ]
        )
    )


class Vitessce:
    def __init__(self, entity=None, nexus_token=None, is_mock=False):
        """Object for building the vitessce configuration.

          >> vitessce = Vitessce(entity, nexus_token)

        """

        # Can there be more than one of these?  This seems like a fine default for now.
        self.assay_type = entity["data_types"][0]
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
        if self.assay_type not in ASSAY_CONF_LOOKUP:
            return {}
        files = ASSAY_CONF_LOOKUP[self.assay_type]["files_conf"]
        file_paths_expected = [file["rel_path"] for file in files]
        file_paths_found = [file["rel_path"] for file in self.entity["files"]]
        conf = ASSAY_CONF_LOOKUP[self.assay_type]["base_conf"]
        # Codex and other tiled assays needs to be built up based on their input tiles.
        if self.assay_type not in TILED_ASSAYS:
            # We need to check that the files we expect actually exist.
            # This is due to the volatility of the datasets.
            if not set(file_paths_expected).issubset(set(file_paths_found)):
                if not self.is_mock:
                    current_app.logger.info(
                        f'Files for assay "{self.assay_type}" '
                        'uuid "{self.uuid}" not found as expected.'
                    )
                return {}
            layers = [self._build_layer_conf(file) for file in files]
            conf["layers"] = layers
            conf["name"] = self.uuid
            conf = self._replace_view(conf)
            self.conf = conf
            return conf
        else:
            found_tiles = _get_tiles(file_paths_found)
            confs = []
            for tile in sorted(found_tiles):
                new_conf = copy.deepcopy(conf)
                layers = [self._build_layer_conf(file, tile) for file in files]
                new_conf["layers"] = layers
                new_conf["name"] = tile
                new_conf = self._replace_view(new_conf)
                confs += [new_conf]
            self.conf = confs
            return confs

    def _build_layer_conf(self, file, tile=""):
        """Build each layer in the layers section.

        returns e.g

        {
          'type': 'CELLS',
          'url': 'https://assets.dev.hubmapconsortium.org/uuid/cells.json',
          'name': 'cells
        }
        """

        return {
            "type": file["type"],
            "url": self._build_assets_url(file["rel_path"].replace("#TILE#", tile))
            if file["type"] != "RASTER"
            else self._build_image_layer_datauri(
                file["rel_path"].replace("#TILE#", tile)
            ),
            "name": file["type"].lower(),
        }

    def _build_image_layer_datauri(self, rel_path):
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
        image_layer["images"] = [self._build_image_schema(rel_path)]
        image_layer["schemaVersion"] = "0.0.2"
        return DataURI.make(
            "text/plain", charset="us-ascii", base64=True, data=json.dumps(image_layer)
        )

    def _build_image_schema(self, rel_path):
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
        schema["name"] = Path(rel_path).name
        schema["type"] = "ome-tiff"
        schema["url"] = self._build_assets_url(rel_path)
        schema["metadata"] = {}
        offsets_path = Path(CODEX_OFFSETS_PATH) / Path(
            Path(rel_path).name.replace("ome.tiff", "offsets.json")
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

        if self.assay_type not in IMAGE_ASSAYS:
            return conf
        conf["staticLayout"][2]["props"]["view"] = ASSAY_CONF_LOOKUP[self.assay_type][
            "view"
        ]
        return conf
