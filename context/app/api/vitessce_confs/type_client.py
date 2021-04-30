from flask import current_app

from hubmap_commons.type_client import TypeClient


_assays = None


def get_assay(self, data_type):
    "Return the assay class for the given data type"
    if _assays is None:
        tc = TypeClient(current_app.config["TYPE_SERVICE_ENDPOINT"])
        _assays = list(_tc.iterAssays())
    matches = filter(lambda x: x.name == data_type, _assays)
    assert len(matches) == 1
    return matches[0]
