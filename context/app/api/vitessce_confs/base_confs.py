import urllib
from pathlib import Path
import re

from flask import current_app
from vitessce import (
    VitessceConfig,
    OmeTiffWrapper,
    Component as cm,
)

from .utils import _get_matches, on_obj
from .constants import AssetPaths


class ViewConf:
    def __init__(self, entity=None, nexus_token=None, is_mock=False):
        """Object for building the vitessce configuration.

          >> vitessce = Vitessce(entity, nexus_token)

        """

        # Can there be more than one of these?  This seems like a fine default for now.
        self.conf = {}
        self._uuid = entity["uuid"]
        self._nexus_token = nexus_token
        self._is_mock = is_mock
        self._entity = entity
        self._build_vitessce_conf()

    def _build_vitessce_conf(self):
        pass

    def _replace_url_in_file(self, file):
        """Build each layer in the layers section.

        returns e.g

        {
          'type': 'CELLS',
          'file_type': 'cells.json',
          'url': 'https://assets.dev.hubmapconsortium.org/uuid/cells.json',
          'name': 'cells'
        }
        """

        return {
            "data_type": file["data_type"],
            "file_type": file["file_type"],
            "url": self._build_assets_url(file["rel_path"]),
        }

    def _build_assets_url(self, rel_path):
        """
      Create a url for an asset.

      returns e.g

      'https://assets.dev.hubmapconsortium.org/uuid/rel_path/to/clusters.ome.tiff',

      """
        if not self._is_mock:
            assets_endpoint = current_app.config["ASSETS_ENDPOINT"]
        else:
            assets_endpoint = MOCK_URL
        base_url = urllib.parse.urljoin(assets_endpoint, f"{self._uuid}/{rel_path}")
        token_param = urllib.parse.urlencode({"token": self._nexus_token})
        return base_url + "?" + token_param


class ImagingViewConf(ViewConf):
    def _get_img_and_offset_url(self, img_path, img_dir):
        img_url = self._build_assets_url(img_path)
        return (
            img_url,
            str(
                re.sub(
                    r"ome\.tiff?",
                    "offsets.json",
                    img_url.replace(img_dir, AssetPaths.OFFSETS_DIR.value),
                )
            ),
        )

    def _setup_view_config_raster(self, vc, dataset):
        spatial = vc.add_view(dataset, cm.SPATIAL)
        status = vc.add_view(dataset, cm.DESCRIPTION)
        lc = vc.add_view(dataset, cm.LAYER_CONTROLLER)
        vc.layout(spatial | (lc / status))
        return vc


class ImagePyramidViewConf(ImagingViewConf):
    def _build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        found_images = _get_matches(
            file_paths_found, re.escape(AssetPaths.IMAGE_PYRAMID_DIR.value) + r"/.*\.ome\.tiff?$"
        )
        vc = VitessceConfig(name="HuBMAP Data Portal")
        dataset = vc.add_dataset(name="Visualization Files")
        for img_path in found_images:
            img_url, offsets_url = self._get_img_and_offset_url(
                img_path, AssetPaths.IMAGE_PYRAMID_DIR.value
            )
            dataset = dataset.add_object(
                OmeTiffWrapper(
                    img_url=img_url, offsets_url=offsets_url, name=Path(img_path).name
                )
            )
        vc = self._setup_view_config_raster(vc, dataset)
        self.conf = vc.to_dict(on_obj=on_obj)
        return self.conf


class ScatterplotViewConf(ViewConf):
    def _build_vitessce_conf(self):
        file_paths_expected = [file["rel_path"] for file in self._files]
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        # We need to check that the files we expect actually exist.
        # This is due to the volatility of the datasets.
        if not set(file_paths_expected).issubset(set(file_paths_found)):
            if not self._is_mock:
                current_app.logger.info(
                    f'Files for uuid "{self._uuid}" not found as expected.'
                )
            return {}
        vc = VitessceConfig(name="HuBMAP Data Portal")
        dataset = vc.add_dataset(name="Visualization Files")
        for file in self._files:
            dataset = dataset.add_file(**(self._replace_url_in_file(file)))
        vc = self._setup_scatterplot_view_config(vc, dataset)
        self.conf = vc.to_dict(on_obj=on_obj)
        return self.conf

    def _setup_scatterplot_view_config(self, vc, dataset):
        umap = vc.add_view(dataset, cm.SCATTERPLOT, mapping="UMAP")
        cell_sets = vc.add_view(dataset, cm.CELL_SETS)
        vc.layout(umap | cell_sets)
        return vc
