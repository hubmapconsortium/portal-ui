import json
from pathlib import Path
import re

import pytest

from .base_confs import ImagePyramidViewConfBuilder, SPRMJSONViewConfBuilder
from .assay_confs import (
    SeqFISHViewConfBuilder,
    TiledSPRMViewConfBuilder,
    RNASeqViewConfBuilder,
    ATACSeqViewConfBuilder,
    IMSViewConfBuilder,
    RNASeqAnnDataZarrViewConfBuilder,
    SpatialRNASeqAnnDataZarrViewConfBuilder,
    SPRMAnnDataViewConfBuilder,
    StitchedCytokitSPRMViewConfBuilder
)

MOCK_GROUPS_TOKEN = "groups_token"

FIXTURES_INPUT_DIR = "fixtures/input_entity"
FIXTURES_EXPECTED_OUTPUT_DIR = "fixtures/output_expected"

BASE_NAME_FOR_SPRM = "BASE_NAME"

builders = {
    "cytokit_json": TiledSPRMViewConfBuilder,
    "rna": RNASeqViewConfBuilder,
    "atac": ATACSeqViewConfBuilder,
    "ims": IMSViewConfBuilder,
    "image_pyramid": ImagePyramidViewConfBuilder,
    "seqfish": SeqFISHViewConfBuilder,
    "sprm": SPRMJSONViewConfBuilder,
    "rna_zarr": RNASeqAnnDataZarrViewConfBuilder,
    "rna_azimuth_zarr": RNASeqAnnDataZarrViewConfBuilder,
    "spatial_rna_zarr": SpatialRNASeqAnnDataZarrViewConfBuilder,
    "sprm_anndata": SPRMAnnDataViewConfBuilder,
    "cytokit_anndata": StitchedCytokitSPRMViewConfBuilder
}


parent_dir = Path(__file__).parent
fixtures_dir = parent_dir / FIXTURES_INPUT_DIR
entity_paths = set(fixtures_dir.glob("*_entity.json")) - set(
    fixtures_dir.glob("malformed_*_entity.json")
)


@pytest.mark.parametrize("entity_file", entity_paths)
def test_assays(entity_file):
    assay = re.search(
        r'([^/]+)_entity.json',
        entity_file.name,
    )[1]
    entity = json.loads(entity_file.read_text())
    Builder = builders[assay]
    if assay in ["sprm", "sprm_anndata"]:
        builder = Builder(
            entity=entity,
            groups_token=MOCK_GROUPS_TOKEN,
            is_mock=True,
            base_name=BASE_NAME_FOR_SPRM,
            imaging_path="imaging_path",
            image_name="expressions",
            mask_name="mask",
            mask_path="imaging_path"
        )
    else:
        builder = Builder(
            entity=entity, groups_token=MOCK_GROUPS_TOKEN, is_mock=True
        )
    conf = builder.get_conf_cells().conf
    conf_expected = json.loads(
        (
            parent_dir / f"{FIXTURES_EXPECTED_OUTPUT_DIR}/{assay}_conf.json"
        ).read_text()
    )
    assert conf_expected == conf
    malformed_entity = json.loads(
        Path(str(entity_file).replace(assay, f"malformed_{assay}")).read_text()
    )
    Builder = builders[assay]
    if assay in ["sprm", "sprm_anndata"]:
        builder = Builder(
            entity=malformed_entity,
            groups_token=MOCK_GROUPS_TOKEN,
            is_mock=True,
            base_name=BASE_NAME_FOR_SPRM,
            imaging_path="imaging_path",
            image_name="expressions",
            mask_name="mask",
            mask_path="imaging_path"
        )
    else:
        builder = Builder(
            entity=malformed_entity, groups_token=MOCK_GROUPS_TOKEN, is_mock=True
        )
    with pytest.raises(FileNotFoundError):
        builder.get_conf_cells().conf
