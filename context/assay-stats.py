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
    }

def _flatten_buckets(es_aggregations):
    return es_aggregations


def main():
    response = requests.post(
        'https://search.api.hubmapconsortium.org/portal/search',
        json={
            "aggs": {
                "all_assay_types": {
                    "filter": {
                        "term": {
                            "entity_type.keyword": "Dataset"
                        }
                    },
                    "aggs": _aggs_from_fields(['data_types', 'mapped_data_types'])
                }
            },
            "size": 0,
        }
    )
    print(yaml.dump(_flatten_buckets(response.json()['aggregations'])))
    return 0

if __name__ == "__main__":
    exit_status = main()
    sys.exit(exit_status)
