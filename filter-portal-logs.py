#!/usr/bin/env python3

from sys import argv
from pathlib import Path
from re import subn, MULTILINE

class Filterer:
    def __init__(self, logs):
        self.logs = logs
        self.report = {}
    def _filter_one(self, pattern):
        (logs, num_matches) = subn(pattern, '', self.logs, flags=MULTILINE)
        self.report[pattern] = num_matches
        self.logs = logs
    def filter_all(self):
        self._filter_one('^.*ERROR in client: Expected only one descendant on.*$\n')


if __name__ == "__main__":
    logs = Path(argv[1]).read_text()
    filterer = Filterer(logs)
    filterer.filter_all()
    print('Old errors:')
    print(filterer.report)
    print('\nNew errors:')
    print(filterer.logs)
