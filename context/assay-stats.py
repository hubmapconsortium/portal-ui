#!/usr/bin/env python3
import sys
import argparse

import requests
import yaml

def _aggs_from_fields(fields):
    if not fields:
        return {}
    first, rest = fields[0], fields[1:]
    return {
        "agg": {
            "terms": {
                "field": f'{first}.keyword',
                "size": 10000
            },
            "aggs": _aggs_from_fields(rest)
        }
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


def _tabulate(agg_buckets, path=[]):
    for bucket in agg_buckets:
        if 'agg' not in bucket or not bucket['agg']['buckets']:
            print(f"| {bucket['doc_count']} | {' | '.join(path)} | {bucket['key']} |")
        else:
            _tabulate(bucket['agg']['buckets'], path + [bucket['key']])

def main():
    root = 'ROOT'
    fields = [
        'data_types', 'mapped_data_types',
        'metadata.metadata.assay_type',
        'metadata.metadata.assay_category',
        'metadata.metadata.analyte_class',
    ]
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
                    "aggs": _aggs_from_fields(fields)
                }
            },
            "size": 0,
        }
    )
    agg_buckets = _flatten_buckets(response.json()['aggregations'][root]['agg']['buckets'])
    print(f"| {' | '.join(['count'] + list(reversed(fields)))} |")
    print(f"| {' | '.join(['---']*(len(fields) + 1))} |")
    _tabulate(agg_buckets)

    # 
    return 0

if __name__ == "__main__":
    exit_status = main()
    sys.exit(exit_status)
