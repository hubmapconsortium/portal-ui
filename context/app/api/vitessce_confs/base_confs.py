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
        self._entity = entity

    def build_vitessce_conf(self):
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
        assets_endpoint = current_app.config["ASSETS_ENDPOINT"]
        base_url = urllib.parse.urljoin(assets_endpoint, f"{self._uuid}/{rel_path}")
        token_param = urllib.parse.urlencode({"token": self._nexus_token})
        return base_url + "?" + token_param


class ImagingViewConf(ViewConf):
    def _get_img_and_offset_url(self, img_path, img_dir):
        print(img_dir, img_path)
        img_url = self._build_assets_url(img_path)
        return (
            img_url,
            str(
                re.sub(
                    r"ome\.tiff?",
                    "offsets.json",
                    str(re.sub(img_dir, AssetPaths.OFFSETS_DIR.value, img_url)),
                )
            ),
        )

    def _setup_view_config_raster(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=9, h=12)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8)
        return vc


class ImagePyramidViewConf(ImagingViewConf):
    def __init__(self, **kwargs):
        self.image_pyramid_regex = AssetPaths.IMAGE_PYRAMID_DIR.value
        super().__init__(**kwargs)

    def build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        found_images = _get_matches(
            file_paths_found, self.image_pyramid_regex + r".*\.ome\.tiff?$",
        )
        vc = VitessceConfig(name="HuBMAP Data Portal")
        dataset = vc.add_dataset(name="Visualization Files")
        for img_path in found_images:
            img_url, offsets_url = self._get_img_and_offset_url(
                img_path, self.image_pyramid_regex
            )
            dataset = dataset.add_object(
                OmeTiffWrapper(
                    img_url=img_url, offsets_url=offsets_url, name=Path(img_path).name
                )
            )
        vc = self._setup_view_config_raster(vc, dataset)
        self.conf = vc.to_dict(on_obj=on_obj)
        return self


class ScatterplotViewConf(ViewConf):
    def build_vitessce_conf(self):
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
        return self

    def _setup_scatterplot_view_config(self, vc, dataset):
        vc.add_view(dataset, cm.SCATTERPLOT, mapping="UMAP", x=0, y=0, w=9, h=12)
        vc.add_view(dataset, cm.CELL_SETS, x=9, y=0, w=3, h=12)
        return vc


class SPRMViewConf(ImagingViewConf):
    def _setup_view_config_raster_cellsets_expression_segmentation(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=7, h=8)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8)
        vc.add_view(dataset, cm.CELL_SETS, x=10, y=6, w=2, h=6)
        vc.add_view(dataset, cm.GENES, x=10, y=0, w=2, h=6)
        vc.add_view(dataset, cm.HEATMAP, x=3, y=8, w=7, h=4)
        return vc
