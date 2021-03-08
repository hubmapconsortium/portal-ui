from flask import current_app

from hubmap_commons.type_client import TypeClient
from hubmap_commons.singleton_metaclass import SingletonMetaClass


class CommonsTypeClient(object, metaclass=SingletonMetaClass):
    """
    This class builds some constant data structures based on calls to the type client.  It is a
    singleton, which means only a single instance is ever created, so the tables are built only
    once and reused as needed.
    """

    def __init__(self):
        """
        Initialize the type client and build the required tables, which will be accessed as
        attributes of the singleton instance.
        """
        tc = TypeClient(current_app.config["TYPE_SERVICE_ENDPOINT"])
        self._assays = []
        for assay in tc.iterAssays():
            self._assays.append(assay)

    def get_assay(self, data_type):
        "Return the assay class for the given data type"
        assay = list(filter(lambda x: x.name == data_type, self._assays))[0]
        return assay
