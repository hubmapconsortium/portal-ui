#!/usr/bin/env python3

import sys
import argparse
import requests
from csv import DictReader, excel_tab
from io import StringIO

from hubmap_commons.type_client import TypeClient

from portal_visualization.builder_factory import get_view_config_builder


def main():
    parser = argparse.ArgumentParser(
        description='Scan all datasets for visualization bugs.')
    parser.add_argument(
        '--url',
        default='https://portal.hubmapconsortium.org',
        help='Portal instance to download TSV and JSON from')
    args = parser.parse_args()

    tsv_url = f'{args.url}/metadata/v0/datasets.tsv'
    tsv = requests.get(tsv_url).text
    datasets = list(DictReader(StringIO(tsv), dialect=excel_tab))[1:]
    uuids = [dataset['uuid'] for dataset in datasets]
    errors = {}
    for uuid in uuids[:10]:
        dataset_url = f'{args.url}/browse/dataset/{uuid}.json'
        dataset = requests.get(dataset_url).json()
        error = get_error(dataset)
        if error:
            errors[uuid] = error
    print(errors)


def get_assay(name):
    types_service_url = 'https://search.api.hubmapconsortium.org'
    type_client = TypeClient(types_service_url)
    return type_client.getAssayType(name)


def get_error(dataset):
    Builder = get_view_config_builder(entity=dataset, get_assay=get_assay)
    builder = Builder(dataset, None, 'https://assets.hubmapconsortium.org')
    warn(f'Using: {builder.__class__.__name__}')
    try:
        builder.get_conf_cells()
    except Exception as e:
        return e


def warn(s):
    print(s, file=sys.stderr)


if __name__ == "__main__":
    sys.exit(main())
