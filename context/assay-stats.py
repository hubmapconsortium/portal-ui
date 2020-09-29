#!/usr/bin/env python3
import sys
import argparse

import requests
import yaml

def _aggs_from_fields(fields):
    if not fields:
        return {}
    last = fields.pop()
    return {
        last: {
            "terms": {
                "field": f'{last}.keyword',
                "size": 10000
            },
            "aggs": _aggs_from_fields(fields)
        }
        # f'{last}-missing': {
        #     "missing": {"field": f'{last}.keyword'}
        # }
    }

def _flatten_buckets(es_aggregations):
    if not isinstance(es_aggregations, dict):
        return es_aggregations
    return {
        k: (
            [_flatten_buckets(count) for count in v['buckets']]
            if isinstance(v, dict) and 'buckets' in v
            else _flatten_buckets(v)
        )
        for k, v in es_aggregations.items()
            if k not in ['doc_count_error_upper_bound', 'sum_other_doc_count']
    }


def main():
    root = 'ROOT'
    response = requests.post(
        'https://search.api.hubmapconsortium.org/portal/search',
        json={
            "aggs": {
                root: {
                    "filter": {
                        "term": {
                            "entity_type.keyword": "Dataset"
                        }
                    },
                    "aggs": _aggs_from_fields(['metadata.metadata.assay_category', 'metadata.metadata.assay_type', 'data_types', 'mapped_data_types'])
                }
            },
            "size": 0,
        }
    )
    print(yaml.dump(_flatten_buckets(response.json()['aggregations'][root])))
    return 0

if __name__ == "__main__":
    exit_status = main()
    sys.exit(exit_status)
