#!/usr/bin/env python3

import argparse
import sys
from pathlib import Path
import json

from jsonschema.validators import Draft7Validator
from yaml import safe_load

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--doc_dir',
        default=Path(__file__).parent / 'cache',
        type=Path)
    parser.add_argument(
        '--schema',
        default=Path(__file__).parent / 'schema/index.yaml',
        type=Path)
    args = parser.parse_args()

    schema = safe_load(args.schema.read_text())
    validator = Draft7Validator(schema)

    i = 0
    for entity_path in args.doc_dir.iterdir():
        entity = json.loads(entity_path.read_text())
        validator.validate(entity)
        print('.', end='', flush=True)
        i += 1
    print(f'\nValidated {i}')
    return 0


if __name__ == "__main__":
    sys.exit(main())  # pragma: no cover
