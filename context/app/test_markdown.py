import pytest

from .routes_markdown import _title_from_md


def test_title_from_md():
    md = 'junk at top\n##   first title   \n# second title\nbody'
    assert _title_from_md(md) == 'first title'
