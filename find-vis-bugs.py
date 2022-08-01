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

    with app.app_context():
        tsv_url = f'{portal_url}/metadata/v0/datasets.tsv'
        tsv = requests.get(tsv_url).text
        datasets = list(DictReader(StringIO(tsv), dialect=excel_tab))[1:]
        uuids = [dataset['uuid'] for dataset in datasets]
        errors = {}
        for (i, uuid) in enumerate(uuids):
            dataset_url = f'{portal_url}/browse/dataset/{uuid}.json'
            dataset = requests.get(dataset_url).json()
            warn(f'{i}/{len(uuids)}: Checking {dataset["uuid"]}...')
            try:
                client.get_vitessce_conf_cells_and_lifted_uuid(dataset, wrap_error=False)
            except Exception as e:
                errors[uuid] = e

    if not errors:
        print('No errors')
        sys.exit(0)
    for k, v in errors.items():
        print(f'{k}\t{v}')
    exit(1)



def warn(s):
    print(s, file=sys.stderr)


if __name__ == "__main__":
    sys.exit(main())
