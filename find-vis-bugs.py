#!/usr/bin/env python3

import sys
import csv
import argparse
import requests


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
    print(tsv)


def warn(s):
    print(s, file=sys.stderr)


if __name__ == "__main__":
    sys.exit(main())
