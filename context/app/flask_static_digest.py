import json
from pathlib import Path

from flask import url_for as flask_url_for


class FlaskStaticDigest(object):
    def __init__(self, app=None):
        self.app = app

        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.manifest_path = Path(app.static_folder) / 'public/manifest.json'
        self.has_manifest = self.manifest_path.exists()

        self.manifest = json.loads(self.manifest_path.read_text()) if self.has_manifest else {}

        app.add_template_global(self.static_url_for)

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
