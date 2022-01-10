from pathlib import Path
import re

from vitessce import (
    VitessceConfig,
    MultiImageWrapper,
    OmeTiffWrapper,
    Component as cm,
)

from ..utils import get_matches, group_by_file_name
from ..paths import IMAGE_PYRAMID_DIR, OFFSETS_DIR, SEQFISH_HYB_CYCLE_REGEX, SEQFISH_FILE_REGEX
from .base_builders import ViewConfBuilder, ConfCells


class AbstractImagingViewConfBuilder(ViewConfBuilder):
    def _get_img_and_offset_url(self, img_path, img_dir):
        """Create a url for the offsets and img.
        :param str img_path: The path of the image
        :param str img_dir: The image-specific part of the path to be
        replaced by the OFFSETS_DIR constant.
        :rtype: tuple The image url and the offsets url

        >>> from pprint import pprint
        >>> from .doctest_utils import app_context
        >>> with app_context():
        ...   vc = AbstractImagingViewConfBuilder(
        ...     entity={ "uuid": "uuid" }, groups_token='groups_token')
        ...   pprint(vc._get_img_and_offset_url("rel_path/to/clusters.ome.tiff", "rel_path/to"))
        ('https://example.com/uuid/rel_path/to/clusters.ome.tiff?token=groups_token',\n\
         'https://example.com/uuid/output_offsets/clusters.offsets.json?token=groups_token')

        """
        img_url = self._build_assets_url(img_path)
        return (
            img_url,
            str(
                re.sub(
                    r"ome\.tiff?",
                    "offsets.json",
                    re.sub(img_dir, OFFSETS_DIR, img_url),
                )
            ),
        )

    def _setup_view_config_raster(self, vc, dataset, disable_3d=[]):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=9, h=12)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8).set_props(
            disable3d=disable_3d
        )
        return vc


class ImagePyramidViewConfBuilder(AbstractImagingViewConfBuilder):
    def __init__(self, entity, groups_token, **kwargs):
        """Wrapper class for creating a standard view configuration for image pyramids,
        i.e for high resolution viz-lifted imaging datasets like
        https://portal.hubmapconsortium.org/browse/dataset/dc289471333309925e46ceb9bafafaf4
        """
        self.image_pyramid_regex = IMAGE_PYRAMID_DIR
        super().__init__(entity, groups_token, **kwargs)

    def get_conf_cells(self):
        file_paths_found = self._get_file_paths()
        found_images = [
            path for path in get_matches(
                file_paths_found, self.image_pyramid_regex + r".*\.ome\.tiff?$",
            )
            if 'separate/' not in path  # Excluse separate/* in MALDI-IMS
        ]
        if len(found_images) == 0:
            message = (
                f"Image pyramid assay with uuid {self._uuid} has no matching files"
            )
            raise FileNotFoundError(message)

        vc = VitessceConfig(name="HuBMAP Data Portal")
        dataset = vc.add_dataset(name="Visualization Files")
        images = []
        for img_path in found_images:
            img_url, offsets_url = self._get_img_and_offset_url(
                img_path, self.image_pyramid_regex
            )
            images.append(
                OmeTiffWrapper(
                    img_url=img_url, offsets_url=offsets_url, name=Path(img_path).name
                )
            )
        dataset = dataset.add_object(MultiImageWrapper(images))
        vc = self._setup_view_config_raster(vc, dataset)
        conf = vc.to_dict()
        # Don't want to render all layers
        del conf["datasets"][0]["files"][0]["options"]["renderLayers"]
        return ConfCells(conf, None)


class IMSViewConfBuilder(ImagePyramidViewConfBuilder):
    """Wrapper class for generating a Vitessce configurations
    for IMS data that excludes the image pyramids
    of all the channels separated out.
    """

    def __init__(self, entity, groups_token, **kwargs):
        super().__init__(entity, groups_token, **kwargs)
        # Do not show the separated mass-spec images.
        self.image_pyramid_regex = (
            re.escape(IMAGE_PYRAMID_DIR) + r"(?!/ometiffs/separate/)"
        )


class SeqFISHViewConfBuilder(AbstractImagingViewConfBuilder):
    """Wrapper class for generating Vitessce configurations,
    one per position, with the hybridization cycles
    grouped together per position in a single Vitessce configuration.
    """

    def get_conf_cells(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        full_seqfish_reqex = "/".join(
            [
                IMAGE_PYRAMID_DIR,
                SEQFISH_HYB_CYCLE_REGEX,
                SEQFISH_FILE_REGEX
            ]
        )
        found_images = get_matches(file_paths_found, full_seqfish_reqex)
        if len(found_images) == 0:
            message = f'seqFish assay with uuid {self._uuid} has no matching files'
            raise FileNotFoundError(message)
        # Get all files grouped by PosN names.
        images_by_pos = group_by_file_name(found_images)
        confs = []
        # Build up a conf for each Pos.
        for images in images_by_pos:
            image_wrappers = []
            pos_name = self._get_pos_name(images[0])
            vc = VitessceConfig(name=pos_name)
            dataset = vc.add_dataset(name=pos_name)
            sorted_images = sorted(images, key=self._get_hybcycle)
            for img_path in sorted_images:
                img_url, offsets_url = self._get_img_and_offset_url(
                    img_path, IMAGE_PYRAMID_DIR
                )
                image_wrappers.append(
                    OmeTiffWrapper(
                        img_url=img_url,
                        offsets_url=offsets_url,
                        name=self._get_hybcycle(img_path),
                    )
                )
            dataset = dataset.add_object(MultiImageWrapper(image_wrappers))
            vc = self._setup_view_config_raster(
                vc,
                dataset,
                disable_3d=[self._get_hybcycle(img_path) for img_path in sorted_images]
            )
            conf = vc.to_dict()
            # Don't want to render all layers
            del conf["datasets"][0]["files"][0]["options"]["renderLayers"]
            confs.append(conf)
        return ConfCells(confs, None)

    def _get_hybcycle(self, image_path):
        return re.search(SEQFISH_HYB_CYCLE_REGEX, image_path)[0]

    def _get_pos_name(self, image_path):
        return re.search(SEQFISH_FILE_REGEX, image_path)[0].split(".")[
            0
        ]
