from functools import wraps
from unittest.mock import patch
from hubmap_commons.type_client import TypeClient, DummyTypeClient

from .vitessce import Vitessce, _group_by_file_name, Const
from . import vitessce

TEST_ENTITY_CODEX = {
    "data_types": ["codex_cytokit"],
    "uuid": "uuid",
    "files": [{"rel_path": "codex/path/codex.ome.tiff"}, ],
}

TEST_ENTITY_RNASEQ = {
    "data_types": ["salmon_rnaseq_10x"],
    "uuid": "uuid",
    "files": [
        {"rel_path": "cluster-marker-genes/output/cluster_marker_genes.cells.json"},
        {"rel_path": "cluster-marker-genes/output/cluster_marker_genes.cell-sets.json"},
    ],
}

TEST_ENTITY_RNASEQ_EMPTY = {
    "data_types": ["salmon_rnaseq_10x"],
    "uuid": "uuid",
    "files": [
        {"rel_path": "bad/output/cluster_marker_genes.cells.json"},
        {"rel_path": "bad/output/cluster_marker_genes.cell-sets.json"},
    ],
}

TEST_NEXUS_TOKEN = "nexus_token"

TEST_UUID = "uuid"

TEST_PATH_TIFF = "path/to/example.ome.tiff"

MOCK_URL = "https://example.com"

TYPE_SERVICE_URL = "http://mock.type.service/"

SEARCH_SCHEMA_ASSAYS = 'https://raw.githubusercontent.com/hubmapconsortium/search-api'\
    '/master/src/search-schema/data/definitions/enums/assay_types.yaml'


def apply_patches(func):
    @wraps(func)
    @patch(vitessce.__name__ + ".TypeClient", DummyTypeClient)
    @patch(__name__ + ".TypeClient", DummyTypeClient)
    @patch(vitessce.__name__ + ".current_app")
    def wrapper(mock1=None):
        return func(mock1=mock1)
    return wrapper


@apply_patches
def test_build_image_schema(mock1=None):
    vitessce = Vitessce(
        entity=TEST_ENTITY_CODEX, nexus_token=TEST_NEXUS_TOKEN, is_mock=True
    )
    schema = vitessce._build_image_schema(image_rel_path=TEST_PATH_TIFF)
    assert schema["name"] == "example.ome.tiff"
    assert (
        schema["url"]
        == f"https://example.com/uuid/path/to/example.ome.tiff?token={TEST_NEXUS_TOKEN}"
    )
    assert schema["type"] == "ome-tiff"
    assert (
        schema["metadata"]["omeTiffOffsetsUrl"]
        == f"https://example.com/uuid/path/to/example.offsets.json?token={TEST_NEXUS_TOKEN}"
    )


@apply_patches
def test_build_assets_url(mock1=None):
    vitessce = Vitessce(
        entity=TEST_ENTITY_CODEX, nexus_token=TEST_NEXUS_TOKEN, is_mock=True
    )
    url = vitessce._build_assets_url(rel_path=TEST_PATH_TIFF)
    assert (
        url
        == f"https://example.com/uuid/path/to/example.ome.tiff?token={TEST_NEXUS_TOKEN}"
    )


@apply_patches
def test_build_layer_conf(mock1=None):
    vitessce = Vitessce(
        entity=TEST_ENTITY_RNASEQ, nexus_token=TEST_NEXUS_TOKEN, is_mock=True
    )
    vitessce._build_vitessce_conf()
    conf = vitessce.conf
    layer = conf["layers"][0]
    vitessce_component = conf["staticLayout"][0]["component"]
    assert layer["type"] == "CELLS"
    assert layer["fileType"] == "cells.json"
    assert layer["name"] == "cells"
    assert vitessce_component == "cellSets"


@apply_patches
def test_build_layer_conf_empty(mock1=None):
    vitessce = Vitessce(
        entity=TEST_ENTITY_RNASEQ_EMPTY, nexus_token=TEST_NEXUS_TOKEN, is_mock=True
    )
    vitessce._build_vitessce_conf()
    conf = vitessce.conf
    assert conf == {}


@apply_patches
def test_group_by_file_name(mock1=None):
    data = ['foo/bar.sh', 'zap/bar.sh', 'jazz/bar.js', 'jazz/not_bar.js']
    grouped = _group_by_file_name(data)
    # Grouped by file name.
    assert [['jazz/bar.js'], ['foo/bar.sh', 'zap/bar.sh'], ['jazz/not_bar.js']] == grouped


@apply_patches
def test_data_types(mock1=None):
    search_assay_types = [name for name in TypeClient(TYPE_SERVICE_URL).iterAssayNames()]
    assert(all([assay in search_assay_types for assay in Const().SC_DATA_TYPES]))
