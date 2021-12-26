import json
from pathlib import Path

import pytest
from flask import Flask

from .assay_confs import get_view_config_builder


entity_paths = list((Path(__file__).parent / 'fixtures').glob("*/*-entity.json"))
assert len(entity_paths) > 0


@pytest.mark.parametrize("entity_path", entity_paths)
def test_entity_to_vitessce_conf(entity_path):
    app = Flask(__name__)
    app.config['TYPE_SERVICE_ENDPOINT'] = 'https://search.api.hubmapconsortium.org'
    app.config['ASSETS_ENDPOINT'] = 'https://example.com'
    with app.app_context():
        entity = json.loads(entity_path.read_text())
        Builder = get_view_config_builder(entity)

        mock_groups_token = "groups_token"
        try:
            builder = Builder(
                entity=entity,
                groups_token=mock_groups_token,
                base_name="BASE_NAME",
                imaging_path="imaging_path",
                image_name="expressions",
                mask_name="mask",
                mask_path="imaging_path"
            )
        except TypeError:
            builder = Builder(
                entity=entity,
                groups_token=mock_groups_token,
            )
        assert type(builder).__name__ == entity_path.parent.name

        conf_path = entity_path.parent / entity_path.name.replace('-entity', '-conf')
        conf_expected = json.loads(conf_path.read_text())

        conf = builder.get_conf_cells().conf
        assert conf_expected == conf
