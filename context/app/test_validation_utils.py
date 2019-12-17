import pytest
import flask

from unittest.mock import MagicMock

from .validation_utils import for_each_validation_error


def test_multiple_errors():
    callback = MagicMock()
    for_each_validation_error(
        {},
        {'required': ['required_1', 'required_2']},
        callback
    )
    assert callback.call_count == 2
