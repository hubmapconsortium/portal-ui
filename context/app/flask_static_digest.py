import json
from pathlib import Path

from flask import url_for as flask_url_for

# Source path the Vite dev server transforms and serves at /static/public/.
# Must match the entry input in context/vite.config.ts.
_VITE_DEV_ENTRY = 'app/static/js/index.tsx'


class FlaskStaticDigest(object):
    """
    Bridges Flask's static-asset URL generation with the frontend build manifest.

    Production: reads context/app/static/public/manifest.json (a webpack-style
    flat ``{"main.js": "/static/public/main.HASH.js"}`` map emitted by the
    custom plugin in vite.config.ts) and resolves hashed URLs.

    Development: when no manifest is present, exposes ``vite_dev_mode = True``
    to templates so they can render the Vite dev server's module entry tags
    (``@vite/client`` plus the source ``.tsx`` entry) instead of hashed URLs.
    """

    def __init__(self, app=None):
        self.app = app

        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.manifest_path = Path(app.static_folder) / 'public/manifest.json'
        self.has_manifest = self.manifest_path.exists()

        self.manifest = json.loads(self.manifest_path.read_text()) if self.has_manifest else {}

        app.add_template_global(self.static_url_for)
        app.add_template_global(self.vite_dev_mode, name='vite_dev_mode')
        app.add_template_global(self.vite_dev_entry, name='vite_dev_entry')

    def static_url_for(self, endpoint, **values):
        """
        This function uses Flask's url_for under the hood and accepts the
        same arguments. The only difference is when a manifest is available
        it will look up the filename from the manifest.
        :param endpoint: The endpoint of the URL
        :type endpoint: str
        :param values: Arguments of the URL rule
        :return: Static file path.
        """
        filename = values.get('filename')
        temp_filename = Path(self.manifest[filename]).name if self.has_manifest else filename

        values.update({'filename': 'public/' + temp_filename})
        return flask_url_for(endpoint, **values)

    def vite_dev_mode(self):
        """True when no production manifest is present (i.e., the Vite dev
        server is expected to be serving assets)."""
        return not self.has_manifest

    def vite_dev_entry(self):
        """Source path the Vite dev server serves under /static/public/."""
        return _VITE_DEV_ENTRY
