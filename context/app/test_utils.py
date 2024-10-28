from .utils import find_earliest_ancestor
from unittest.mock import Mock


def test_find_earliest_ancestor():
    client = Mock()

    initial_uuid = "uuid_initial"
    ancestor_uuid = "uuid_ancestor"

    client.get_entities.side_effect = [
        # First call returns initial dataset with an ancestor
        [{
            "hubmap_id": "initial_id",
            "uuid": initial_uuid,
            "immediate_ancestors": [{"uuid": ancestor_uuid, "entity_type": "Dataset"}],
            "entity_type": "Dataset"
        }],
        # Second call returns no ancestors
        [{
            "hubmap_id": "ancestor_id",
            "uuid": ancestor_uuid,
            "immediate_ancestors": [],
            "entity_type": "Dataset"
        }]
    ]

    result = find_earliest_ancestor(client, initial_uuid)

    assert result == ancestor_uuid
    client.get_entities.assert_called_with(
        'datasets',
        query_override={
            "bool": {
                "must": {
                    "term": {
                        "uuid": ancestor_uuid
                    }
                }
            }
        },
        non_metadata_fields=['hubmap_id', 'uuid', 'immediate_ancestors', 'entity_type']
    )


def test_find_earliest_ancestor_no_ancestors():
    client = Mock()
    uuid = "uuid_no_ancestors"

    # Return a dataset with no ancestors
    client.get_entities.return_value = [{
        "hubmap_id": "no_ancestor_id",
        "uuid": uuid,
        "immediate_ancestors": [],
        "entity_type": "Dataset"
    }]

    result = find_earliest_ancestor(client, uuid)

    assert result == uuid
    client.get_entities.assert_called_once_with(
        'datasets',
        query_override={
            "bool": {
                "must": {
                    "term": {
                        "uuid": uuid
                    }
                }
            }
        },
        non_metadata_fields=['hubmap_id', 'uuid', 'immediate_ancestors', 'entity_type']
    )
