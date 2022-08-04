#!/usr/bin/env python3

from pathlib import Path
import sys
import argparse
import requests
from csv import DictReader, excel_tab
from io import StringIO
from time import perf_counter

from flask import Flask

# Run from anywhere:
sys.path.append(str(Path(__file__).parent.parent.parent))
from context.app.api.client import ApiClient  # noqa: E402


client = ApiClient()


def main():
    parser = argparse.ArgumentParser(
        description='Scan all datasets for visualization bugs. Exits with status 0 if no errors.')
    parser.add_argument(
        '--portal_url',
        default='https://portal.hubmapconsortium.org',
        help='Portal instance to download TSV and JSON from')
    parser.add_argument(
        '--types_url',
        default='https://search.api.hubmapconsortium.org',
        help='Type Service endpoint')
    parser.add_argument(
        '--assets_url',
        default='https://assets.hubmapconsortium.org',
        help='Assets endpoint')
    args = parser.parse_args()

    portal_url = args.portal_url
    types_url = args.types_url
    assets_url = args.assets_url

    app = Flask(__name__)
    app.config.from_mapping({
        'TYPE_SERVICE_ENDPOINT': types_url,
        'ASSETS_ENDPOINT': assets_url
    })

    tsv_url = f'{portal_url}/metadata/v0/datasets.tsv'
    tsv = requests.get(tsv_url).text
    datasets = list(DictReader(StringIO(tsv), dialect=excel_tab))[1:]
    uuids = [dataset['uuid'] for dataset in datasets]
    errors = {}
    waiting_for_json = 0
    waiting_for_conf = 0
    for (i, uuid) in enumerate(uuids):
        dataset_url = f'{portal_url}/browse/dataset/{uuid}'
        dataset_json_url = f'{dataset_url}.json'
        before_json = perf_counter()
        dataset = requests.get(dataset_json_url).json()
        waiting_for_json += perf_counter() - before_json
        warn(f'{i}/{len(uuids)} ({len(errors)} errors): Checking {dataset_url} ...')
        try:
            before_conf = perf_counter()
            with app.app_context():
                client.get_vitessce_conf_cells_and_lifted_uuid(dataset, wrap_error=False)
            waiting_for_conf += perf_counter() - before_conf
        except Exception as e:
            warn(f'ERROR: {e}')
            errors[dataset_url] = e
        warn(f'JSON: {waiting_for_json:.2f}s; Vitessce: {waiting_for_conf:.2f}s')

    if not errors:
        print('No errors')
        sys.exit(0)
    for k, v in errors.items():
        print(f'{k}\t{v}')
    sys.exit(1)


def warn(s):
    print(s, file=sys.stderr)


if __name__ == "__main__":
    sys.exit(main())
