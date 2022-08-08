#!/usr/bin/env python3

from pathlib import Path
import sys
import argparse
from time import perf_counter

from flask import Flask

# Run from anywhere:
sys.path.append(str(Path(__file__).parent.parent.parent))
from context.app.api.client import ApiClient  # noqa: E402


def get_context(args):
    search_url = args.search_url
    types_url = args.types_url
    assets_url = args.assets_url

    app = Flask(__name__)
    app.config.from_mapping({
        'TYPE_SERVICE_ENDPOINT': types_url,
        'ASSETS_ENDPOINT': assets_url,
        'ELASTICSEARCH_ENDPOINT': search_url,
        'PORTAL_INDEX_PATH': '/portal/search'  # TODO: pull from default_config.py
    })

    return app.app_context()


def get_errors():
    errors = {}
    client = ApiClient()
    uuids = client.get_all_dataset_uuids()
    waiting_for_json = 0
    waiting_for_conf = 0
    for (i, uuid) in enumerate(uuids):
        before_json = perf_counter()
        dataset = client.get_entity(uuid=uuid)
        waiting_for_json += perf_counter() - before_json
        warn(f'{i}/{len(uuids)} ({len(errors)} errors): Checking {uuid} ...')
        try:
            before_conf = perf_counter()
            client.get_vitessce_conf_cells_and_lifted_uuid(dataset, wrap_error=False)
            waiting_for_conf += perf_counter() - before_conf
        except Exception as e:
            warn(f'ERROR: {e}')
            errors[uuid] = e
        warn(f'JSON: {waiting_for_json:.2f}s; Vitessce: {waiting_for_conf:.2f}s')
    return errors


def main():
    parser = argparse.ArgumentParser(
        description='Scan all datasets for visualization bugs. Exits with status 0 if no errors.')
    parser.add_argument(
        '--search_url',
        default='https://search.api.hubmapconsortium.org',
        help='Search API endpoint')
    parser.add_argument(
        '--types_url',
        default='https://search.api.hubmapconsortium.org',
        help='Type Service endpoint')
    parser.add_argument(
        '--assets_url',
        default='https://assets.hubmapconsortium.org',
        help='Assets endpoint')

    with get_context(parser.parse_args()):
        errors = get_errors()

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
