import urllib
from collections import namedtuple

from flask import current_app


ConfCells = namedtuple('ConfCells', ['conf', 'cells'])


class NullViewConfBuilder():
    def __init__(self, entity, groups_token, **kwargs):
        # Just so it has the same signature as the other builders
        pass

    def get_conf_cells(self):
        return ConfCells(None, None)


class ViewConfBuilder:
    def __init__(self, entity, groups_token, **kwargs):
        """Object for building the vitessce configuration.
        :param dict entity: Entity response from search index (from the entity API)
        :param str groups_token: Groups token for use in authenticating API

        >>> vc = ViewConfBuilder(
        ...     entity={"uuid": "uuid"}, groups_token='groups_token')

        """

        self._uuid = entity["uuid"]
        self._groups_token = groups_token
        self._entity = entity
        self._files = []

    def get_conf_cells(self):
        raise NotImplementedError

    def _replace_url_in_file(self, file):
        """Replace url in incoming file object
        :param dict file: File dict which will have its rel_path replaced by url
        :rtype: dict The file with rel_path replaced by url

        >>> from pprint import pprint
        >>> from .doctest_utils import app_context
        >>> with app_context():
        ...   vc = ViewConfBuilder(
        ...     entity={"uuid": "uuid"}, groups_token='groups_token')
        ...   file = { 'data_type': 'CELLS', 'file_type': 'cells.json', 'rel_path': 'cells.json' }
        ...   pprint(vc._replace_url_in_file(file))
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

        >>> from pprint import pprint
        >>> from .doctest_utils import app_context
        >>> with app_context():
        ...   vc = ViewConfBuilder(
        ...     entity={"uuid": "uuid"}, groups_token='groups_token')
        ...   vc._build_assets_url("rel_path/to/clusters.ome.tiff")
        'https://example.com/uuid/rel_path/to/clusters.ome.tiff?token=groups_token'

        """
        assets_endpoint = current_app.config["ASSETS_ENDPOINT"]
        base_url = urllib.parse.urljoin(assets_endpoint, f"{self._uuid}/{rel_path}")
        token_param = urllib.parse.urlencode({"token": self._groups_token})
        return f"{base_url}?{token_param}" if use_token else base_url

    def _get_request_init(self):
        """Get request headers for requestInit parameter in Vitessce conf.
        This is needed for non-public zarr stores because the client forms URLs for zarr chunks,
        not the above _build_assets_url function.

        >>> entity = {"uuid": "uuid", "status": "QA"}
        >>> vc = ViewConfBuilder(entity=entity, groups_token='groups_token')
        >>> vc._get_request_init()
        {'headers': {'Authorization': 'Bearer groups_token'}}
        >>> entity = {"uuid": "uuid", "status": "Published"}
        >>> vc = ViewConfBuilder(entity=entity, groups_token='groups_token')
        >>> assert vc._get_request_init() is None # None because dataset is Published (public)
        """
        if self._entity["status"] == "Published":
            # Extra headers outside of a select few cause extra CORS-preflight requests which
            # can slow down the webpage.  If the dataset is published, we don't need to use
            # header to authenticate access to the assets API.
            # See: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests
            return None
        return {"headers": {"Authorization": f"Bearer {self._groups_token}"}}

    def _get_file_paths(self):
        """Get all rel_path keys from the entity dict.

        >>> files = [{ "rel_path": "path/to/file" }, { "rel_path": "path/to/other_file" }]
        >>> entity = {"uuid": "uuid", "files": files}
        >>> vc = ViewConfBuilder(entity=entity, groups_token='groups_token')
        >>> vc._get_file_paths()
        ['path/to/file', 'path/to/other_file']
        """
        return [file["rel_path"] for file in self._entity["files"]]
