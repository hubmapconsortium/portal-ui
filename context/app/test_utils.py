import pytest
from unittest.mock import Mock
from .utils import find_earliest_ancestor


@pytest.mark.parametrize(
    "initial_uuid, side_effect, expected_result",
    [
        # Dataset with no ancestors
        (
            "uuid_no_ancestors",
            [
                [{
                    "hubmap_id": "no_ancestor_id",
                    "uuid": "uuid_no_ancestors",
                    "immediate_ancestors": [],
                    "entity_type": "Dataset"
                }]
            ],
            "uuid_no_ancestors"
        ),
        # Dataset with non-dataset ancestors
        # (
        #     "uuid_no_dataset_ancestors",
        #     [
        #         [{
        #             "hubmap_id": "initial_id",
        #             "uuid": "uuid_no_dataset_ancestors",
        #             "immediate_ancestors": [{"uuid": "uuid_ancestor", "entity_type": "Sample"}],
        #             "entity_type": "Dataset"
        #         }],
        #         [{
        #             "hubmap_id": "ancestor_id",
        #             "uuid": "uuid_ancestor",
        #             "immediate_ancestors": [],
        #             "entity_type": "Sample"
        #         }]
        #     ],
        #     "uuid_no_dataset_ancestors"
        # ),
        # Dataset with a parent
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
        # Dataset with a grandparent
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
                    "immediate_ancestors": [],
                    "entity_type": "Dataset"
                }]
            ],
            "uuid_ancestor2"
        ),

    ]
)
def test_find_earliest_ancestor(initial_uuid, side_effect, expected_result):
    client = Mock()
    client.get_entities.side_effect = side_effect

    result = find_earliest_ancestor(client, initial_uuid)

    assert result == expected_result

    for uuid in [initial_uuid] + [
        ancestor["uuid"] for dataset in side_effect for ancestor in dataset[0].get(
            "immediate_ancestors",
            []
        )
    ]:
        client.get_entities.assert_any_call(
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
