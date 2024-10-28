import pytest
from unittest.mock import Mock
from .utils import find_earliest_ancestor


@pytest.mark.parametrize(
    "initial_uuid, side_effect, expected_result",
    [
        # Dataset with no ancestors
        (
            "uuid_initial",
            [
                [{
                    "hubmap_id": "initial_id",
                    "uuid": "uuid_initial",
                    "immediate_ancestors": [],
                    "entity_type": "Dataset"
                }]
            ],
            "uuid_initial"
        ),
        # Dataset with a non-dataset parent
        (
            "uuid_initial",
            [
                [{
                    "hubmap_id": "initial_id",
                    "uuid": "uuid_initial",
                    "immediate_ancestors": [{"uuid": "uuid_ancestor", "entity_type": "Sample"}],
                    "entity_type": "Dataset"
                }],
                [{
                    "hubmap_id": "ancestor_id",
                    "uuid": "uuid_ancestor",
                    "immediate_ancestors": [],
                    "entity_type": "Sample"
                }]
            ],
            "uuid_initial"
        ),
        # Dataset with a dataset parent
        (
            "uuid_initial",
            [
                [{
                    "hubmap_id": "initial_id",
                    "uuid": "uuid_initial",
                    "immediate_ancestors": [{"uuid": "uuid_ancestor", "entity_type": "Dataset"}],
                    "entity_type": "Dataset"
                }],
                [{
                    "hubmap_id": "ancestor_id",
                    "uuid": "uuid_ancestor",
                    "immediate_ancestors": [],
                    "entity_type": "Dataset"
                }]
            ],
            "uuid_ancestor"
        ),
        # Dataset with a dataset grandparent
        (
            "uuid_initial",
            [
                [{
                    "hubmap_id": "initial_id",
                    "uuid": "uuid_initial",
                    "immediate_ancestors": [{"uuid": "uuid_ancestor1", "entity_type": "Dataset"}],
                    "entity_type": "Dataset"
                }],
                [{
                    "hubmap_id": "ancestor1_id",
                    "uuid": "uuid_ancestor1",
                    "immediate_ancestors": [{"uuid": "uuid_ancestor2", "entity_type": "Dataset"}],
                    "entity_type": "Dataset"
                }],
                [{
                    "hubmap_id": "ancestor2_id",
                    "uuid": "uuid_ancestor2",
                    "immediate_ancestors": [{"uuid": "uuid_ancestor3", "entity_type": "Donor"}],
                    "entity_type": "Dataset"
                }],
                [{
                    "hubmap_id": "ancestor3_id",
                    "uuid": "uuid_ancestor3",
                    "immediate_ancestors": [],
                    "entity_type": "Donor"
                }]
            ],
            "uuid_ancestor2"
        ),
        # Dataset with a dataset great-grandparent
        (
            "uuid_initial",
            [
                [{
                    "hubmap_id": "initial_id",
                    "uuid": "uuid_initial",
                    "immediate_ancestors": [{"uuid": "uuid_ancestor1", "entity_type": "Dataset"}],
                    "entity_type": "Dataset"
                }],
                [{
                    "hubmap_id": "ancestor1_id",
                    "uuid": "uuid_ancestor1",
                    "immediate_ancestors": [{"uuid": "uuid_ancestor2", "entity_type": "Dataset"}],
                    "entity_type": "Dataset"
                }],
                [{
                    "hubmap_id": "ancestor2_id",
                    "uuid": "uuid_ancestor2",
                    "immediate_ancestors": [{"uuid": "uuid_ancestor3", "entity_type": "Dataset"}],
                    "entity_type": "Dataset"
                }],
                [{
                    "hubmap_id": "ancestor3_id",
                    "uuid": "uuid_ancestor3",
                    "immediate_ancestors": [{"uuid": "uuid_ancestor4", "entity_type": "Donor"}],
                    "entity_type": "Dataset"
                }],
                [{
                    "hubmap_id": "ancestor4_id",
                    "uuid": "uuid_ancestor4",
                    "immediate_ancestors": [],
                    "entity_type": "Donor"
                }]
            ],
            "uuid_ancestor3"
        ),

    ]
)
def test_find_earliest_ancestor(initial_uuid, side_effect, expected_result):
    client = Mock()
    client.get_entities.side_effect = side_effect

    result = find_earliest_ancestor(client, initial_uuid)
    print('initial_uuid:', initial_uuid)
    print('result:', result)

    assert result == expected_result
