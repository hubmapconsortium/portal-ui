import json
from pathlib import Path
import re

import pytest
from flask import Flask

from .assay_confs import get_view_config_builder


MOCK_GROUPS_TOKEN = "groups_token"

FIXTURES_INPUT_DIR = "fixtures/input_entity"
FIXTURES_EXPECTED_OUTPUT_DIR = "fixtures/output_expected"

BASE_NAME_FOR_SPRM = "BASE_NAME"


parent_dir = Path(__file__).parent
fixtures_dir = parent_dir / FIXTURES_INPUT_DIR
entity_paths = set(fixtures_dir.glob("*_entity.json")) - set(
    fixtures_dir.glob("malformed_*_entity.json")
)


@pytest.mark.parametrize("entity_file", entity_paths)
def test_assays(entity_file):
    app = Flask(__name__)
    app.config['TYPE_SERVICE_ENDPOINT'] = 'https://search.api.hubmapconsortium.org'
    with app.app_context():

        assay = re.search(
            r'([^/]+)_entity.json',
            entity_file.name,
        )[1]

        entity = json.loads(entity_file.read_text())
        Builder = get_view_config_builder(entity)

        try:
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
        except TypeError:
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
        try:
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
        except TypeError:
            builder = Builder(
                entity=malformed_entity, groups_token=MOCK_GROUPS_TOKEN, is_mock=True
            )
        with pytest.raises(FileNotFoundError):
            builder.get_conf_cells().conf
