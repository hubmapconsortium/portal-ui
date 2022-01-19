import json
from pathlib import Path

import pytest
from flask import Flask

from .builder_factory import get_view_config_builder


entity_paths = list((Path(__file__).parent / 'fixtures').glob("*/*-entity.json"))
assert len(entity_paths) > 0


@pytest.mark.parametrize(
    "entity_path", entity_paths, ids=lambda path: f'{path.parent.name}/{path.name}')
def test_entity_to_vitessce_conf(entity_path):
    app = Flask(__name__)
    app.config['TYPE_SERVICE_ENDPOINT'] = 'https://search.api.hubmapconsortium.org'
    app.config['ASSETS_ENDPOINT'] = 'https://example.com'
    with app.app_context():
        entity = json.loads(entity_path.read_text())
        Builder = get_view_config_builder(entity)
        assert Builder.__name__ == entity_path.parent.name

        builder = Builder(entity, "groups_token")
        conf = builder.get_conf_cells().conf

        conf_expected_path = entity_path.parent / entity_path.name.replace('-entity', '-conf')
        conf_expected = json.loads(conf_expected_path.read_text())

        assert conf_expected == conf
