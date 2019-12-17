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


def test_single_error():
    callback = MagicMock()
    for_each_validation_error(
        {'required_1': 'value'},
        {'required': ['required_1', 'required_2']},
        callback
    )
    assert callback.call_count == 1


def test_called_without_url():
    def callback(error):
        assert error.message == "'required_1' is a required property"
        assert error.issue_url == None
    for_each_validation_error(
        {},
        {'required': ['required_1']},
        callback
    )


def test_called_with_url():
    def callback(error):
        assert error.message == "'required_1' is a required property"
        assert error.issue_url == 'github url'
    for_each_validation_error(
        {},
        {
            'required_TODO': 'github url',
            'required': ['required_1']
        },
        callback
    )


def test_deep():
    def callback(error):
        assert error.issue_url == 'github url'
    for_each_validation_error(
        {},
        {
            'properties': {
                'outer': {
                    'properties': {
                        'inner': {
                            'required_TODO': 'github url',
                            'required': ['deep_prop']
                        }
                    }
                }
            }
        },
        callback
    )
