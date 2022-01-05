from vitessce import (
    VitessceConfig,
    AnnDataWrapper,
    Component as cm,
)

from .base_builders import ViewConfBuilder, ConfCells


class RNASeqAnnDataZarrViewConfBuilder(ViewConfBuilder):
    """Wrapper class for creating a AnnData-backed view configuration
    for "second generation" post-August 2020 RNA-seq data from anndata-to-ui.cwl like
    https://portal.hubmapconsortium.org/browse/dataset/e65175561b4b17da5352e3837aa0e497
    """

    def __init__(self, entity, groups_token, **kwargs):
        super().__init__(entity, groups_token, **kwargs)
        # Spatially resolved RNA-seq assays require some special handling,
        # and others do not.
        self._is_spatial = False

    def get_conf_cells(self):
        zarr_path = 'hubmap_ui/anndata-zarr/secondary_analysis.zarr'
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        # Use .zgroup file as proxy for whether or not the zarr store is present.
        if f'{zarr_path}/.zgroup' not in file_paths_found:
            message = f'RNA-seq assay with uuid {self._uuid} has no matching .zarr store'
            raise FileNotFoundError(message)
        vc = VitessceConfig(name=self._uuid)
        adata_url = self._build_assets_url(zarr_path, use_token=False)
        # Some of the keys (like marker_genes_for_heatmap) here are from our pipeline
        # https://github.com/hubmapconsortium/portal-containers/blob/master/containers/anndata-to-ui
        # while others come from Matt's standard scanpy pipeline
        # or AnnData default (like X_umap or X).
        cell_set_obs = ["leiden"]
        cell_set_obs_names = ["Leiden"]
        dags = [dag
                for dag in self._entity['metadata']['dag_provenance_list'] if 'name' in dag]
        if(any(['azimuth-annotate' in dag['origin'] for dag in dags])):
            cell_set_obs.append("predicted.ASCT.celltype")
            cell_set_obs_names.append("Predicted ASCT Cell Type")
        dataset = vc.add_dataset(name=self._uuid).add_object(AnnDataWrapper(
            adata_url=adata_url,
            mappings_obsm=["X_umap"],
            mappings_obsm_names=["UMAP"],
            spatial_centroid_obsm=("X_spatial" if self._is_spatial else None),
            cell_set_obs=cell_set_obs,
            cell_set_obs_names=cell_set_obs_names,
            expression_matrix="X",
            matrix_gene_var_filter="marker_genes_for_heatmap",
            factors_obs=[
                "marker_gene_0",
                "marker_gene_1",
                "marker_gene_2",
                "marker_gene_3",
                "marker_gene_4"
            ],
            request_init=self._get_request_init()
        )
        )
        vc = self._setup_anndata_view_config(vc, dataset)
        return ConfCells(vc.to_dict(), None)

    def _setup_anndata_view_config(self, vc, dataset):
        vc.add_view(dataset, cm.SCATTERPLOT, mapping="UMAP", x=0, y=0, w=4, h=6)
        vc.add_view(dataset, cm.CELL_SET_EXPRESSION, x=4, y=0, w=5, h=6)
        vc.add_view(dataset, cm.CELL_SETS, x=9, y=0, w=3, h=3)
        vc.add_view(dataset, cm.GENES, x=9, y=4, w=3, h=3)
        vc.add_view(dataset, cm.HEATMAP, x=0, y=6, w=12, h=4)
        return vc


class SpatialRNASeqAnnDataZarrViewConfBuilder(RNASeqAnnDataZarrViewConfBuilder):
    """Wrapper class for creating a AnnData-backed view configuration
    for "second generation" post-August 2020 spatial RNA-seq data from anndata-to-ui.cwl like
    https://portal.hubmapconsortium.org/browse/dataset/e65175561b4b17da5352e3837aa0e497
    """

    def __init__(self, entity, groups_token, **kwargs):
        super().__init__(entity, groups_token, **kwargs)
        # Spatially resolved RNA-seq assays require some special handling,
        # and others do not.
        self._is_spatial = True

    def _setup_anndata_view_config(self, vc, dataset):
        vc.add_view(dataset, cm.SCATTERPLOT, mapping="UMAP", x=0, y=0, w=4, h=6)
        spatial = vc.add_view(dataset, cm.SPATIAL, x=4, y=0, w=5, h=6)
        [cells_layer] = vc.add_coordination('spatialCellsLayer')
        cells_layer.set_value(
            {
                "visible": True,
                "stroked": False,
                "radius": 20,
                "opacity": 1,
            }
        )
        spatial.use_coordination(cells_layer)
        vc.add_view(dataset, cm.CELL_SETS, x=9, y=0, w=3, h=3)
        vc.add_view(dataset, cm.GENES, x=9, y=4, w=3, h=3)
        vc.add_view(dataset, cm.HEATMAP, x=0, y=6, w=7, h=4)
        vc.add_view(dataset, cm.CELL_SET_EXPRESSION, x=7, y=6, w=5, h=4)
        return vc
