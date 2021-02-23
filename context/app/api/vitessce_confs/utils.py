from pathlib import Path
import re
from itertools import groupby

from vitessce import DataType as dt

from .constants import AssetPaths


def _get_matches(files, regex):
    return list(
        set(
            [
                match[0]
                for match in set(re.search(regex, file) for file in files)
                if match
            ]
        )
    )


def _exclude_matches(files, regex):
    return list(set(file for file in files if not re.search(regex, file)))


def _get_path_name(file):
    return Path(file).name


def _group_by_file_name(files):
    sorted_files = sorted(files, key=_get_path_name)
    return [list(g) for _, g in groupby(sorted_files, _get_path_name)]


def create_obj_routes(obj, dataset_uid, obj_i):
    """
    For a particular data object, simultaneously set up:

    * its server routes and their responses, and
    * the corresponding view config dataset file definitions

    :param obj: An object representing a single-cell data analysis result or microscopy image.
    :type obj: anndata.AnnData or loompy.LoomConnection or zarr.hierarchy.Group

    :returns: A list of view config file definitions and a list of server routes.
    :rtype: tuple[list[dict], list[starlette.routing.Route]]
    """
    obj_file_defs = []
    obj_routes = []
    base_url = ""
    for data_type in dt:
        try:
            dt_obj_file_defs, dt_obj_routes = obj._get_data(
                data_type, base_url, dataset_uid, obj_i
            )
            obj_file_defs += dt_obj_file_defs
            obj_routes += dt_obj_routes
        except NotImplementedError:
            pass

    return obj_file_defs, obj_routes


def on_obj(obj, dataset_uid, obj_i):
    obj_file_defs, obj_routes = create_obj_routes(obj, dataset_uid, obj_i)
    return obj_file_defs
