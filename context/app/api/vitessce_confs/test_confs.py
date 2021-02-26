import json
import os

from .base_confs import ViewConf, ImagingViewConf, ImagePyramidViewConf, MOCK_URL
from .assay_confs import (
    SeqFISHViewConf,
    CytokitSPRMConf,
    RNASeqConf,
    ATACSeqConf,
    IMSConf,
)

MOCK_NEXUS_TOKEN = "nexus_token"

MOCK_UUID = "abcd"

MOCK_DIR = "path/to"

MOCK_FILE_PATH = f"{MOCK_DIR}/file.ome.tiff"

MOCK_FILE_URL = f"{MOCK_URL}/{MOCK_UUID}/{MOCK_FILE_PATH}?token={MOCK_NEXUS_TOKEN}"


def test_build_assets_url():

    vc = ViewConf(
        entity={"uuid": MOCK_UUID}, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True
    )
    url = vc._build_assets_url(MOCK_FILE_PATH)
    assert url == MOCK_FILE_URL


def test_replace_url_in_file():

    file = {
        "data_type": "foo",
        "file_type": "bar",
        "rel_path": MOCK_FILE_PATH,
    }
    vc = ViewConf(
        entity={"uuid": MOCK_UUID}, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True
    )
    new_file = vc._replace_url_in_file(file)
    assert new_file["url"] == MOCK_FILE_URL
    assert new_file["data_type"] == file["data_type"]
    assert new_file["file_type"] == file["file_type"]


def test_get_img_and_offset_url():
    vc = ImagingViewConf(
        entity={"uuid": MOCK_UUID}, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True
    )
    img_url, offsets_url = vc._get_img_and_offset_url(
        img_path=MOCK_FILE_PATH, img_dir=MOCK_DIR
    )
    assert img_url == MOCK_FILE_URL
    assert (
        offsets_url
        == f"{MOCK_URL}/{MOCK_UUID}/output_offsets/file.offsets.json?token={MOCK_NEXUS_TOKEN}"
    )


def test_codex():
    assay = "codex"
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/input_entity/{assay}_entity.json"
        ),
        "r",
    ) as f:
        entity = json.loads(f.read())
    vc = CytokitSPRMConf(entity=entity, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True)
    vc.build_vitessce_conf()
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/output_expected/{assay}_conf.json"
        ),
        "r",
    ) as f:
        conf_expected = json.loads(f.read())
    assert conf_expected == vc.conf


def test_image_pyramid():
    assay = "image_pyramid"
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/input_entity/{assay}_entity.json"
        ),
        "r",
    ) as f:
        entity = json.loads(f.read())
    vc = ImagePyramidViewConf(entity=entity, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True)
    vc.build_vitessce_conf()
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/output_expected/{assay}_conf.json"
        ),
        "r",
    ) as f:
        conf_expected = json.loads(f.read())
    assert conf_expected == vc.conf


def test_ims():
    assay = "ims"
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/input_entity/{assay}_entity.json"
        ),
        "r",
    ) as f:
        entity = json.loads(f.read())
    vc = IMSConf(entity=entity, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True)
    vc.build_vitessce_conf()
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/output_expected/{assay}_conf.json"
        ),
        "r",
    ) as f:
        conf_expected = json.loads(f.read())
    assert conf_expected == vc.conf


def test_seqfish():
    assay = "seqfish"
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/input_entity/{assay}_entity.json"
        ),
        "r",
    ) as f:
        entity = json.loads(f.read())
    vc = SeqFISHViewConf(entity=entity, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True)
    vc.build_vitessce_conf()
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/output_expected/{assay}_conf.json"
        ),
        "r",
    ) as f:
        conf_expected = json.loads(f.read())
    assert conf_expected == vc.conf


def test_rna():
    assay = "rna"
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/input_entity/{assay}_entity.json"
        ),
        "r",
    ) as f:
        entity = json.loads(f.read())
    vc = RNASeqConf(entity=entity, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True)
    vc.build_vitessce_conf()
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/output_expected/{assay}_conf.json"
        ),
        "r",
    ) as f:
        conf_expected = json.loads(f.read())
    assert conf_expected == vc.conf


def test_atac():
    assay = "atac"
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/input_entity/{assay}_entity.json"
        ),
        "r",
    ) as f:
        entity = json.loads(f.read())
    vc = ATACSeqConf(entity=entity, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True)
    vc.build_vitessce_conf()
    with open(
        os.path.join(
            os.path.dirname(__file__), f"fixtures/output_expected/{assay}_conf.json"
        ),
        "r",
    ) as f:
        conf_expected = json.loads(f.read())
    assert conf_expected == vc.conf
