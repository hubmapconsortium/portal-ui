import urllib
from pathlib import Path
import json
import itertools
from datauri import DataURI

from flask import current_app

# TODO: Only for Demo! #

# Hardcoded CODEX offsets and tile path.
CODEX_OFFSETS_PATH = "ppneorh7"
CODEX_TILE_PATH = "output/extract/expressions/ome-tiff"
# Hardocde just looking at a few tiles.
X_VALS = list(range(3))
X_VALS.remove(0)
Y_VALS = list(range(3))
Y_VALS.remove(0)
R_VALS = list(range(3))
R_VALS.remove(0)

# END: Only for Demo! #

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
            "w": 12,
            "h": 6,
        },
    ],
}

IMAGING = {
    "name": "NAME",
    "layers": [],
    "staticLayout": [
        {"component": "layerController", "x": 0, "y": 0, "w": 4, "h": 6},
        {
            "component": "spatial",
            "props": {"view": {}, },
            "x": 4,
            "y": 0,
            "w": 8,
            "h": 6,
        },
    ],
}


ASSAY_CONF_LOOKUP = {
    "salmon_rnaseq_10x": {
        "base_conf": SCATTERPLOT,
        "files_conf": [
            {
                "rel_path": "dim_reduced_clustered/dim_reduced_clustered.json",
                "type": "CELLS",
            },
            # This doesn't exist right now.
            # { 'rel_path': 'cluster-marker-genes/cluster_marker_genes.json', 'type': 'FACTORS' }
        ],
    },
    "codex_cytokit": {
        "base_conf": IMAGING,
        "view": {"zoom": -1.5, "target": [600, 600, 0], },
        "files_conf": [
            # Hardcoded for now only one tile.
            {
                "rel_path": Path(CODEX_TILE_PATH) / Path(f"#CODEX_TILE#.ome.tiff"),
                "type": "RASTER",
            }
        ],
    },
}

IMAGE_ASSAYS = ["codex_cytokit"]

MOCK_URL = "https://example.com"


class Vitessce:
    def __init__(self, entity=None, nexus_token=None, is_mock=False):
        """Object for building the vitessce configuration.

          >>> vitessce = Vitessce(entity, nexus_token)

        """

        # Can there be more than one of these?  This seems like a fine default for now.
        self.assay_type = entity["data_types"][0]
        self.uuid = entity["uuid"]
        self.nexus_token = nexus_token
        self.is_mock = is_mock
        self.conf = None
        self._build_vitessce_conf()

    def _build_vitessce_conf(self):
        """Vuilding the vitessce configuration.

        >>> vitessce = Vitessce(entity, nexus_token)
        >>> vitessce.conf

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

        conf = ASSAY_CONF_LOOKUP[self.assay_type]["base_conf"]
        files = ASSAY_CONF_LOOKUP[self.assay_type]["files_conf"]
        layers = [
            self._build_layer_conf(file, self.uuid, self.assay_type) for file in files
        ]

        conf["layers"] = layers
        conf["name"] = self.uuid

        conf = self._replace_view(conf)

        self.conf = conf

    def _build_layer_conf(self, file, uuid, assay_type):
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
            "url": self._build_assets_url(file["rel_path"], uuid)
            if assay_type not in IMAGE_ASSAYS
            else self._build_image_layer_datauri(file["rel_path"], uuid),
            "name": file["type"].lower(),
        }

    def _build_image_layer_datauri(self, rel_path, uuid):
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
        # For CODEX replace the tiles. Otherwise this next line does nothing.
        image_paths = [
            str(rel_path).replace(
                "#CODEX_TILE#",
                f"R{str(r).zfill(3)}_X{str(x).zfill(3)}_Y{str(y).zfill(3)}",
            )
            for (r, x, y) in itertools.product(*[R_VALS, X_VALS, Y_VALS])
        ]
        image_layer["images"] = [
            self._build_image_schema(image_path, uuid) for image_path in image_paths
        ]
        image_layer["schema_version"] = "0.0.1"
        return DataURI.make(
            "text/plain", charset="us-ascii", base64=True, data=json.dumps(image_layer)
        )

    def _build_image_schema(self, rel_path, uuid):
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
        schema["url"] = self._build_assets_url(rel_path, uuid)
        schema["metadata"] = {}
        offsets_path = Path(CODEX_OFFSETS_PATH) / Path(
            Path(rel_path).name.replace("ome.tiff", "offsets.json")
        )
        schema["metadata"]["omeTiffOffsetsUrl"] = self._build_assets_url(
            str(offsets_path), uuid
        )
        return schema

    def _build_assets_url(self, rel_path, uuid):
        """
      Create a url for an asset.

      returns e.g

      'https://assets.dev.hubmapconsortium.org/uuid/rel_path/to/clusters.ome.tiff',

      """
        if not self.is_mock:
            assets_endpoint = current_app.config["ASSETS_ENDPOINT"]
        else:
            assets_endpoint = MOCK_URL
        base_url = urllib.parse.urljoin(
            assets_endpoint, str(Path(uuid) / Path(rel_path))
        )
        token_param = urllib.parse.urlencode({"token": self.nexus_token})
        return base_url + "?" + token_param

    def _replace_view(self, conf):
        """
      Replace the 'view' section of IMAGE_ASSAYS with a reasonable initial view.
      """

        if self.assay_type not in IMAGE_ASSAYS:
            return conf
        conf["staticLayout"][1]["props"]["view"] = ASSAY_CONF_LOOKUP[self.assay_type][
            "view"
        ]
        return conf
