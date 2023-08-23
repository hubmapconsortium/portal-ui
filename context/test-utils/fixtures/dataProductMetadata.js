// Metadata object taken from dataset 277152f17b5a2f308820ab4d85c5a426 on test
// Contains the files and dag list used for the data products specs

const metadata = {
  dag_provenance_list: [
    {
      hash: 'cb4e85e',
      origin: 'https://github.com/hubmapconsortium/ingest-pipeline.git',
    },
    {
      hash: 'cb4e85e',
      origin: 'https://github.com/hubmapconsortium/ingest-pipeline.git',
    },
    {
      hash: 'ce04e2c',
      name: 'pipeline.cwl',
      origin: 'https://github.com/hubmapconsortium/salmon-rnaseq',
    },
    {
      hash: '7e22a88',
      name: 'anndata-to-ui.cwl',
      origin: 'https://github.com/hubmapconsortium/portal-containers',
    },
  ],
  files: [
    {
      description: "RNA velocity results, in HDF5 format, readable with the 'anndata' Python package",
      edam_term: 'EDAM_1.24.format_3590',
      is_data_product: true,
      is_qa_qc: false,
      rel_path: 'scvelo_annotated.h5ad',
      size: 241689276,
      type: 'h5ad',
    },
    {
      description:
        "Raw gene expression, in HDF5 format, readable with the 'anndata' Python package, intronic counts collapsed to genes",
      edam_term: 'EDAM_1.24.format_3590',
      is_data_product: true,
      is_qa_qc: false,
      rel_path: 'expr.h5ad',
      size: 139404600,
      type: 'h5ad',
    },
    {
      description: 'UMAP plot of cells, colored by Leiden cluster ID',
      edam_term: 'EDAM_1.24.format_3508',
      is_qa_qc: false,
      rel_path: 'umap_by_leiden_cluster.pdf',
      size: 50018,
      type: 'pdf',
    },
    {
      description:
        "Normalized gene expression with additional metadata, in HDF5 format, readable with the 'anndata' Python package",
      edam_term: 'EDAM_1.24.format_3590',
      is_data_product: true,
      is_qa_qc: false,
      rel_path: 'secondary_analysis.h5ad',
      size: 338168367,
      type: 'h5ad',
    },
    {
      description: 'Quality control results, per-cell and per-gene, in HDF5 format',
      edam_term: 'EDAM_1.24.format_3590',
      is_qa_qc: true,
      rel_path: 'qc_results.hdf5',
      size: 3174000,
      type: 'hdf5',
    },
    {
      description: 'Disperson plot of gene expression',
      edam_term: 'EDAM_1.24.format_3508',
      is_qa_qc: false,
      rel_path: 'dispersion_plot.pdf',
      size: 623573,
      type: 'pdf',
    },
    {
      description: 'UMAP plot of cells, colored by embedding density',
      edam_term: 'EDAM_1.24.format_3508',
      is_qa_qc: false,
      rel_path: 'umap_embedding_density.pdf',
      size: 379128,
      type: 'pdf',
    },
    {
      description: 'scVelo RNA velocity stream plot',
      edam_term: 'EDAM_1.24.format_3508',
      is_qa_qc: false,
      rel_path: 'scvelo_embedding_stream.pdf',
      size: 125096,
      type: 'pdf',
    },
    {
      description: 'scVelo RNA velocity grid plot',
      edam_term: 'EDAM_1.24.format_3508',
      is_qa_qc: false,
      rel_path: 'scvelo_embedding_grid.pdf',
      size: 144715,
      type: 'pdf',
    },
    {
      description:
        "Raw gene expression, in HDF5 format, readable with the 'anndata' Python package, intronic counts collapsed to genes",
      edam_term: 'EDAM_1.24.format_3590',
      is_qa_qc: false,
      rel_path: 'raw_expr.h5ad',
      size: 68922240,
      type: 'h5ad',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/obsp/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/obsp/distances/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/obsp/connectivities/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/var/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/obsm/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/obs/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/obs/__categories/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/layers/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/layers/unspliced/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/layers/spliced_unspliced_sum/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/layers/spliced/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/varm/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/neighbors/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/neighbors/params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/velocity_params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/umap/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/umap/params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/recover_dynamics/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/velocity_graph/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/velocity_graph_neg/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/leiden/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/leiden/params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/pca/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of velocity analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/scvelo_annotated.zarr/uns/pca/params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/obs/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/obs/__categories/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/hvg/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/umap/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/umap/params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/rank_genes_groups/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/rank_genes_groups/params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/neighbors/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/neighbors/params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/leiden/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/leiden/params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/pca/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/pca/params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/uns/umap_density_params/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/varm/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/layers/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/layers/unspliced/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/layers/spliced_unspliced_sum/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/layers/spliced/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/layers/unscaled/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/obsp/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/obsp/connectivities/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/obsp/distances/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/obsm/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'AnnData Zarr store for storing and visualizing single cell sequencing outputs of UMAP/clustering analysis.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/anndata-zarr/secondary_analysis.zarr/var/.zgroup',
      size: 24,
      type: 'unknown',
    },
    {
      description:
        'JSON-formatted information about this scRNA-seq run including scatterplot coordinates and clustering.',
      edam_term: 'EDAM_1.24.format_3464',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/output/secondary_analysis.cells.json',
      size: 258347,
      type: 'json',
    },
    {
      description: "JSON-formatted information about the heirarchy scRNA-seq's cells.",
      edam_term: 'EDAM_1.24.format_3464',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/output/secondary_analysis.cell-sets.json',
      size: 55635,
      type: 'json',
    },
    {
      description: 'Input data relevant for visualization saved in columnar Apache Arrow format.',
      edam_term: 'EDAM_1.24.format_2333',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/output/secondary_analysis.arrow',
      size: 63674,
      type: 'arrow',
    },
    {
      description: 'Input data relevant for visualization saved in columnar comma-separated-file format.',
      edam_term: 'EDAM_1.24.format_3752',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/output/secondary_analysis.csv',
      size: 82560,
      type: 'csv',
    },
    {
      description: "JSON-formatted information about this scRNA-seq's clustering.",
      edam_term: 'EDAM_1.24.format_3464',
      is_qa_qc: false,
      rel_path: 'hubmap_ui/output/secondary_analysis.factors.json',
      size: 52836,
      type: 'json',
    },
    {
      description: 'FastQC report of input FASTQ file',
      edam_term: 'EDAM_1.24.format_2331',
      is_qa_qc: true,
      rel_path: 'fastqc_output/B005-A-002_S2_L002_R1_001_fastqc.html',
      size: 510470,
      type: 'unknown',
    },
    {
      description: 'FastQC report of input FASTQ file',
      edam_term: 'EDAM_1.24.format_2331',
      is_qa_qc: true,
      rel_path: 'fastqc_output/B005-A-002_S2_L002_R2_001_fastqc.html',
      size: 636135,
      type: 'unknown',
    },
    {
      description: 'FastQC report of input FASTQ file',
      edam_term: 'EDAM_1.24.format_2331',
      is_qa_qc: true,
      rel_path: 'fastqc_output/B005-A-002_S2_L002_I1_001_fastqc.html',
      size: 411217,
      type: 'unknown',
    },
    {
      description: 'FastQC report of input FASTQ file',
      edam_term: 'EDAM_1.24.format_2331',
      is_qa_qc: true,
      rel_path: 'fastqc_output/B005-A-002_S2_L001_R1_001_fastqc.html',
      size: 508882,
      type: 'unknown',
    },
    {
      description: 'FastQC report of input FASTQ file',
      edam_term: 'EDAM_1.24.format_2331',
      is_qa_qc: true,
      rel_path: 'fastqc_output/B005-A-002_S2_L001_I1_001_fastqc.html',
      size: 414078,
      type: 'unknown',
    },
    {
      description: 'FastQC report of input FASTQ file',
      edam_term: 'EDAM_1.24.format_2331',
      is_qa_qc: true,
      rel_path: 'fastqc_output/B005-A-002_S2_L001_R2_001_fastqc.html',
      size: 634729,
      type: 'unknown',
    },
  ],
};

export default metadata;
