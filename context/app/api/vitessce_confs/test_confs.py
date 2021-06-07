import json
from pathlib import Path
import re

import pytest

from .base_confs import ImagePyramidViewConf, SPRMJSONViewConf
from .assay_confs import (
    SeqFISHViewConf,
    TiledSPRMConf,
    RNASeqConf,
    ATACSeqConf,
    IMSConf,
    RNASeqAnnDataZarrConf,
    SPRMAnnDataViewConf,
    StitchedCytokitSPRMConf
)

MOCK_NEXUS_TOKEN = "nexus_token"

FIXTURES_INPUT_DIR = "fixtures/input_entity"
FIXTURES_EXPECTED_OUTPUT_DIR = "fixtures/output_expected"

BASE_NAME_FOR_SPRM = "BASE_NAME"

AssayConfClasses = {
    "cytokit_json": TiledSPRMConf,
    "rna": RNASeqConf,
    "atac": ATACSeqConf,
    "ims": IMSConf,
    "image_pyramid": ImagePyramidViewConf,
    "seqfish": SeqFISHViewConf,
    "sprm": SPRMJSONViewConf,
    "rna_zarr": RNASeqAnnDataZarrConf,
    "sprm_anndata": SPRMAnnDataViewConf,
    "cytokit_anndata": StitchedCytokitSPRMConf
}


def test_assays():
    parent_dir = Path(__file__).parent
    fixtures_dir = parent_dir / FIXTURES_INPUT_DIR
    non_malformed_entities = set(fixtures_dir.glob("*_entity.json")) - set(
        fixtures_dir.glob("malformed_*_entity.json")
    )
    for entity_file in non_malformed_entities:
        assay = re.search(
            str(parent_dir / f"{str(re.escape(FIXTURES_INPUT_DIR))}/(.*)_entity.json"),
            str(entity_file),
        )[1]
        entity = json.loads(Path(entity_file).read_text())
        AssayViewConfClass = AssayConfClasses[assay]
        if assay in ["sprm", "sprm_anndata"]:
            vc = AssayViewConfClass(
                entity=entity,
                nexus_token=MOCK_NEXUS_TOKEN,
                is_mock=True,
                base_name=BASE_NAME_FOR_SPRM,
                imaging_path="imaging_path",
            )
        else:
            vc = AssayViewConfClass(
                entity=entity, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True
            )
        conf = vc.get_conf_cells().conf
        conf_expected = json.loads(
            (
                parent_dir / f"{FIXTURES_EXPECTED_OUTPUT_DIR}/{assay}_conf.json"
            ).read_text()
        )
        assert conf_expected == conf
        malformed_entity = json.loads(
            Path(str(entity_file).replace(assay, f"malformed_{assay}")).read_text()
        )
        AssayViewConfClass = AssayConfClasses[assay]
        if assay in ["sprm", "sprm_anndata"]:
            vc = AssayViewConfClass(
                entity=malformed_entity,
                nexus_token=MOCK_NEXUS_TOKEN,
                is_mock=True,
                base_name=BASE_NAME_FOR_SPRM,
                imaging_path="imaging_path",
            )
        else:
            vc = AssayViewConfClass(
                entity=malformed_entity, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True
            )
        with pytest.raises(FileNotFoundError):
            vc.get_conf_cells().conf
