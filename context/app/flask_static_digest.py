import json
import os


from flask import url_for as flask_url_for

class FlaskStaticDigest(object):
    def __init__(self, app=None):
        self.app = app

        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.manifest_path = os.path.join(app.static_folder,"public/","manifest.json")
        self.has_manifest = os.path.exists(self.manifest_path)

        self.manifest = {}

        if self.has_manifest:
            self.manifest = self._load_manifest(app)

        app.add_template_global(self.static_url_for)

    def _load_manifest(self, app):
        with app.open_resource(self.manifest_path, "r") as f:
            manifest_dict = json.load(f)

        return manifest_dict

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
        filename = values.get("filename")
        new_filename = {}

        if not self.has_manifest:
            temp_filename = filename
        else:
            temp_filename = self.manifest.get(filename).split('/')[-1]
            
        new_filename["filename"] =  "/".join(["public", temp_filename])
        merged_values = {**values, **new_filename}

        return flask_url_for(endpoint, **merged_values)