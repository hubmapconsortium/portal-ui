from vitessce import (
    VitessceConfig,
    Component as cm,
    DataType as dt,
    FileType as ft,
)

from ..paths import SCRNA_SEQ_DIR, SCATAC_SEQ_DIR
from .base_builders import ViewConfBuilder, ConfCells


class AbstractScatterplotViewConfBuilder(ViewConfBuilder):
    """Base class for subclasses creating a JSON-backed scatterplot for
    "first generation" RNA-seq and ATAC-seq data like
    https://portal.hubmapconsortium.org/browse/dataset/d4493657cde29702c5ed73932da5317c
    from h5ad-to-arrow.cwl.
    """

    def get_conf_cells(self):
        file_paths_expected = [file["rel_path"] for file in self._files]
        file_paths_found = self._get_file_paths()
        # We need to check that the files we expect actually exist.
        # This is due to the volatility of the datasets.
        if not set(file_paths_expected).issubset(set(file_paths_found)):
            message = f'Files for uuid "{self._uuid}" not found as expected: ' \
                f'Expected: {file_paths_expected}; Found: {file_paths_found}'
            raise FileNotFoundError(message)
        vc = VitessceConfig(name="HuBMAP Data Portal")
        dataset = vc.add_dataset(name="Visualization Files")
        # The sublcass initializes _files in its __init__ method
        for file in self._files:
            dataset = dataset.add_file(**(self._replace_url_in_file(file)))
        vc = self._setup_scatterplot_view_config(vc, dataset)
        return ConfCells(vc.to_dict(), None)

    def _setup_scatterplot_view_config(self, vc, dataset):
        vc.add_view(dataset, cm.SCATTERPLOT, mapping="UMAP", x=0, y=0, w=9, h=12)
        vc.add_view(dataset, cm.CELL_SETS, x=9, y=0, w=3, h=12)
        return vc


class RNASeqViewConfBuilder(AbstractScatterplotViewConfBuilder):
    """Wrapper class for creating a JSON-backed scatterplot for "first generation" RNA-seq data like
    https://portal.hubmapconsortium.org/browse/dataset/c019a1cd35aab4d2b4a6ff221e92aaab
    from h5ad-to-arrow.cwl (August 2020 release).
    """

    def __init__(self, entity, groups_token, **kwargs):
        super().__init__(entity, groups_token, **kwargs)
        # All "file" Vitessce objects that do not have wrappers.
        self._files = [
            {
                "rel_path": f"{SCRNA_SEQ_DIR}.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": f"{SCRNA_SEQ_DIR}.cell-sets.json",
                "file_type": ft.CELL_SETS_JSON,
                "data_type": dt.CELL_SETS,
            },
        ]


class ATACSeqViewConfBuilder(AbstractScatterplotViewConfBuilder):
    """Wrapper class for creating a JSON-backed scatterplot for "first generation" ATAC-seq data like
    https://portal.hubmapconsortium.org/browse/dataset/d4493657cde29702c5ed73932da5317c
    from h5ad-to-arrow.cwl.
    """

    def __init__(self, entity, groups_token, **kwargs):
        super().__init__(entity, groups_token, **kwargs)
        # All "file" Vitessce objects that do not have wrappers.
        self._files = [
            {
                "rel_path": SCATAC_SEQ_DIR
                + "/umap_coords_clusters.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": SCATAC_SEQ_DIR
                + "/umap_coords_clusters.cell-sets.json",
                "file_type": ft.CELL_SETS_JSON,
                "data_type": dt.CELL_SETS,
            },
        ]
