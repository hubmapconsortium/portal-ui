#!/usr/bin/env python

from json import load
from pathlib import Path

sorted_paths = sorted(
    Path(__file__).parent.glob('outputs/*.json'),
    key=lambda path: path.stem)
for path in sorted_paths:
    with path.open() as f:
        report = load(f)
        print('\t'.join([
            path.stem,
            str(report['aggregate']['latency']['median']),
            ', '.join([f'{k}: {v}' for k, v in report['aggregate']['codes'].items()])
        ]))
