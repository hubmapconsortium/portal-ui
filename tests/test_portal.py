import os
import tempfile

import pytest

import portal

@pytest.fixture
def client():
    app = portal.create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        with app.app_context():
            pass
            # TODO: Any necessary initialization.
            # flaskr.init_db()
        yield client


def test_home(client):
    response = client.get('/')
    assert response.status == '200 OK'
