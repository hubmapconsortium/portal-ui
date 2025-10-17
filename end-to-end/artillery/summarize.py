#!/usr/bin/env python

from json import load
from pathlib import Path


def summarize():
    sorted_paths = sorted(Path(__file__).parent.glob('outputs/*.json'), key=lambda path: path.stem)
    for path in sorted_paths:
        with path.open() as f:
            report = load(f)
            print(
                '\t'.join(
                    [
                        path.stem,
                        str(report['aggregate']['latency']['median']),
                        ', '.join([f'{k}: {v}' for k, v in report['aggregate']['codes'].items()]),
                    ]
                )
            )


if __name__ == '__main__':
    summarize()
