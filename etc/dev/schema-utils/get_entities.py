#!/usr/bin/env python3

import requests
import argparse
import sys
import json
from pathlib import Path
from datetime import date

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--index_url',
        default='https://search.api.hubmapconsortium.org/v3/entities/search')
    parser.add_argument(
        '--dest_dir',
        default=Path(__file__).parent / 'cache',
        type=Path)
    args = parser.parse_args()

    response = requests.post(
        args.index_url,
        json={})
    hits = response.json()['hits']['hits']

    for hit in hits:
        id = hit['_id']
        source = hit['_source']
        entity_type = source['entity_type']
        created_timestamp = source['created_timestamp']
        iso_date = date.fromtimestamp(created_timestamp / 1000)
        name = f'{entity_type}_{iso_date}_{id}.json'
        (args.dest_dir / name).write_text(json.dumps(source, indent=2))

    return 0


if __name__ == "__main__":
    sys.exit(main())  # pragma: no cover
