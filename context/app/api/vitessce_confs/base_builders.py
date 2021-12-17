import urllib
from collections import namedtuple

from flask import current_app

MOCK_URL = "https://example.com"


ConfCells = namedtuple('ConfCells', ['conf', 'cells'])


class NullViewConfBuilder():

    def get_conf_cells(self):
        return ConfCells(None, None)


class ViewConfBuilder:
    def __init__(self, entity=None, groups_token=None, is_mock=False):
        """Object for building the vitessce configuration.
        :param dict entity: Entity response from search index (from the entity API)
        :param str groups_token: Groups token for use in authenticating API
        :param bool is_mock: Wether or not this class is being mocked.

        >>> vc = ViewConfBuilder(
        ...     entity={"uuid": "uuid"}, groups_token='groups_token', is_mock=True)

        """

        self._uuid = entity["uuid"]
        self._groups_token = groups_token
        self._entity = entity
        self._is_mock = is_mock
        self._files = []

    def get_conf_cells(self):
        raise NotImplementedError

    def _replace_url_in_file(self, file):
        """Replace url in incoming file object
        :param dict file: File dict which will have its rel_path replaced by url
        :rtype: dict The file with rel_path replaced by url
        >>> from pprint import pprint
        >>> vc = ViewConfBuilder(
        ...     entity={"uuid": "uuid"}, groups_token='groups_token', is_mock=True)
        >>> file = { 'data_type': 'CELLS', 'file_type': 'cells.json', 'rel_path': 'cells.json' }
        >>> pprint(vc._replace_url_in_file(file))
        {'data_type': 'CELLS',\n\
         'file_type': 'cells.json',\n\
         'url': 'https://example.com/uuid/cells.json?token=groups_token'}
        """

        return {
            "data_type": file["data_type"],
            "file_type": file["file_type"],
            "url": self._build_assets_url(file["rel_path"]),
        }

    def _build_assets_url(self, rel_path, use_token=True):
        """Create a url for an asset.
        :param str rel_path: The path off of which the url should be built
        :param bool use_token: Whether or not to append a groups token to the URL, default True
        :rtype: dict The file with rel_path replaced by url

        >>> vc = ViewConfBuilder(
        ...     entity={"uuid": "uuid"}, groups_token='groups_token', is_mock=True)
        >>> vc._build_assets_url("rel_path/to/clusters.ome.tiff")
        'https://example.com/uuid/rel_path/to/clusters.ome.tiff?token=groups_token'

        """
        if not self._is_mock:
            assets_endpoint = current_app.config["ASSETS_ENDPOINT"]
        else:
            assets_endpoint = MOCK_URL
        base_url = urllib.parse.urljoin(assets_endpoint, f"{self._uuid}/{rel_path}")
        token_param = urllib.parse.urlencode({"token": self._groups_token})
        return f"{base_url}?{token_param}" if use_token else base_url

    def _get_request_init(self):
        """Get request headers for requestInit parameter in Vitessce conf.
        This is needed for non-public zarr stores because the client forms URLs for zarr chunks,
        not the above _build_assets_url function.

        >>> entity = {"uuid": "uuid", "status": "QA"}
        >>> vc = ViewConfBuilder(entity=entity, groups_token='groups_token', is_mock=True)
        >>> vc._get_request_init()
        {'headers': {'Authorization': 'Bearer groups_token'}}
        >>> entity = {"uuid": "uuid", "status": "Published"}
        >>> vc = ViewConfBuilder(entity=entity, groups_token='groups_token', is_mock=True)
        >>> assert vc._get_request_init() is None # None because dataset is Published (public)
        """
        request_init = {"headers": {"Authorization": f"Bearer {self._groups_token}"}}
        # Extra headers outside of a select few cause extra CORS-preflight requests which
        # can slow down the webpage.  If the dataset is published, we don't need to use
        # heaeder to authenticate access to the assets API.
        # See: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests
        use_request_init = False if self._entity["status"] == "Published" else True
        return request_init if use_request_init else None

    def _get_file_paths(self):
        """Get all rel_path keys from the entity dict.

        >>> files = [{ "rel_path": "path/to/file" }, { "rel_path": "path/to/other_file" }]
        >>> entity = {"uuid": "uuid", "files": files}
        >>> vc = ViewConfBuilder(entity=entity, groups_token='groups_token', is_mock=True)
        >>> vc._get_file_paths()
        ['path/to/file', 'path/to/other_file']
        """
        return [file["rel_path"] for file in self._entity["files"]]
