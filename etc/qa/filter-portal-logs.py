#!/usr/bin/env python3

from sys import argv
from pathlib import Path
from re import subn, MULTILINE

from yaml import dump


class Filter:
    '''
    >>> logs = """
    ...     before
    ...     date, host, OSError: write error, tag
    ...     middle
    ...     date, host, Expected only one descendant on ABCD, tag
    ...     end
    ... """
    >>> filter = Filter(logs)
    >>> filter.filter_all()
    >>> print(filter.logs.strip())
    before
        middle
        end
    >>> print(dump(filter.report).strip())
    Expected only one descendant on:
      count: 1
      issue: https://github.com/hubmapconsortium/portal-ui/pull/2522
    'OSError: write error':
      count: 1
      issue: https://github.com/hubmapconsortium/portal-ui/issues/2556
    '''
    def __init__(self, logs):
        self.logs = logs
        self.report = {}

    def _filter_one(self, pattern, issue):
        (logs, count) = subn(rf'^.*{pattern}.*$\n', '', self.logs, flags=MULTILINE)
        if count:
            self.report[pattern] = {
                'count': count,
                'issue': issue
            }
        self.logs = logs

    def filter_all(self):
        self._filter_one(
            r'Expected only one descendant on',
            'https://github.com/hubmapconsortium/portal-ui/pull/2522')
        self._filter_one(
            r'open\(\) ""\S+\.js"" failed',
            'https://github.com/hubmapconsortium/portal-ui/issues/2519')
        self._filter_one(
            # Error spans multiple lines
            r'Exception on /login.*$\n.*handle_user_exception.*$\n.*is not iterable',
            'https://github.com/hubmapconsortium/portal-ui/issues/2518')
        self._filter_one(
            r'OSError: write error',
            'https://github.com/hubmapconsortium/portal-ui/issues/2556')


if __name__ == "__main__":
    logs = Path(argv[1]).read_text()
    filter = Filter(logs)
    filter.filter_all()

    print(filter.logs)
    print('\n\nOld errors:\n')
    print(dump(filter.report))
