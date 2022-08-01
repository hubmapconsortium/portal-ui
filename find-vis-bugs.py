#!/usr/bin/env python3

import sys
import argparse
import requests
from csv import DictReader, excel_tab
from io import StringIO

from flask import Flask

from context.app.api.client import ApiClient


client = ApiClient()


def main():
    parser = argparse.ArgumentParser(
        description='Scan all datasets for visualization bugs.')
    parser.add_argument(
        '--url',
        default='https://portal.hubmapconsortium.org',
        help='Portal instance to download TSV and JSON from')
    args = parser.parse_args()
    portal_url = args.url

    app = Flask(__name__)
    app.config.from_mapping({
        'TYPE_SERVICE_ENDPOINT': 'https://search.api.hubmapconsortium.org',
        'ASSETS_ENDPOINT': 'https://assets.hubmapconsortium.org',
    })
    with app.app_context():
        tsv_url = f'{portal_url}/metadata/v0/datasets.tsv'
        tsv = requests.get(tsv_url).text
        datasets = list(DictReader(StringIO(tsv), dialect=excel_tab))[1:]
        uuids = [dataset['uuid'] for dataset in datasets]
        errors = {}
        for uuid in uuids:
            if uuid != 'c6a254b2dc2ed46b002500ade163a7cc':
                continue
            dataset_url = f'{portal_url}/browse/dataset/{uuid}.json'
            dataset = requests.get(dataset_url).json()
            try:
                client.get_vitessce_conf_cells_and_lifted_uuid(dataset, wrap_error=False)
            except Exception as e:
                errors[uuid] = e
        print(errors)


def warn(s):
    print(s, file=sys.stderr)


if __name__ == "__main__":
    sys.exit(main())
