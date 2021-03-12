import json
from pathlib import Path
import re

from .base_confs import ImagePyramidViewConf
from .assay_confs import (
    SeqFISHViewConf,
    CytokitSPRMConf,
    RNASeqConf,
    ATACSeqConf,
    IMSConf,
)

MOCK_NEXUS_TOKEN = "nexus_token"

FIXTURES_INPUT_DIR = "fixtures/input_entity"
FIXTURES_EXPECTED_OUTPUT_DIR = "fixtures/output_expected"

AssayConfClasses = {
    "codex": CytokitSPRMConf,
    "rna": RNASeqConf,
    "atac": ATACSeqConf,
    "ims": IMSConf,
    "image_pyramid": ImagePyramidViewConf,
    "seqfish": SeqFISHViewConf,
    "malformed": RNASeqConf
}


def test_assays():
    parent_dir = Path(__file__).parent
    for entity_file in (parent_dir / FIXTURES_INPUT_DIR).glob("*_entity.json"):
        assay = re.search(
            str(parent_dir / f"{str(re.escape(FIXTURES_INPUT_DIR))}/(.*)_entity.json"),
            str(entity_file),
        )[1]
        entity = json.loads(Path(entity_file).read_text())
        AssayViewConfClass = AssayConfClasses[assay]
        vc = AssayViewConfClass(
            entity=entity, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True
        )
        conf = vc.build_vitessce_conf()
        conf_expected = json.loads(
            (
                parent_dir / f"{FIXTURES_EXPECTED_OUTPUT_DIR}/{assay}_conf.json"
            ).read_text()
        )
        assert conf_expected == conf
