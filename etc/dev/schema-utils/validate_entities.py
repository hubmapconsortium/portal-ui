#!/usr/bin/env python3

import argparse
import sys
from pathlib import Path
import json

from jsonschema.validators import Draft7Validator
from jsonschema import RefResolver


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--doc_dir',
        default=Path(__file__).parent / 'cache',
        type=Path)
    parser.add_argument(
        '--schema',
        default=Path(__file__).parent / 'schema/index.json',
        type=Path)
    args = parser.parse_args()

    schema = json.loads(args.schema.read_text())
    validator = Draft7Validator(
        schema=schema,
        resolver=RefResolver(
            base_uri=f"{(Path(__file__).parent / 'schema').as_uri()}/",
            referrer=schema,
        ))

    i = 0
    for entity_path in args.doc_dir.iterdir():
        entity = json.loads(entity_path.read_text())
        errors = [
            {
                'message': e.message,
                # 'absolute_schema_path': _as_path_string(e.absolute_schema_path),
                # 'absolute_path': _as_path_string(e.absolute_path)
            } for e in validator.iter_errors(entity)
        ]
        if errors:
            print()
            print(errors)
            break
        print('.', end='', flush=True)
        i += 1
    print(f'\nValidated {i}')
    return 0


if __name__ == "__main__":
    sys.exit(main())  # pragma: no cover
