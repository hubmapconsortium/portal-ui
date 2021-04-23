# Vitessce Visualization

Data for the Vitessce visualization almost always comes via raw data that is processed by [ingest-pipeline](https://github.com/hubmapconsortium/ingest-pipeline) airflow dags. Harvard often contributes our own custom pipelines to these dags that can be found in [portal-containers](https://github.com/hubmapconsortium/portal-containers). The outputs of these pipelines are then converted into view configuration for Vitessce in the [portal backend](https://github.com/hubmapconsortium/portal-ui/tree/master/context/app/api/vitessce_confs) when a `Dataset` that should be visualized is requested in the client. The view configurations are built using the [Vitessce-Python API](https://vitessce.github.io/vitessce-python/index.html).

## Imaging Data

HuBMAP receives various imaging modalities (microscopy and otherwise). The processing is fairly uniform, and always includes running [ome-tiff-pyramid](https://github.com/hubmapconsortium/ome-tiff-pyramid) + a [pipeline](https://github.com/hubmapconsortium/portal-containers/tree/master/containers/ome-tiff-offsets) for extracting byte offsets to [optimize visualization](https://github.com/hms-dbmi/viv/tree/master/tutorial#viewing-in-avivator) load speeds of large imaging datasets. Vitessce is able to view OME-TIFF files directly via [Viv](https://github.com/hms-dbmi/viv). Two pipelines are commonly used for processing the image data with a more analytic orientation: [Cytokit](https://github.com/hubmapconsortium/codex-pipeline) is used to produce segmentations (+ stitching if the input data is tiled) for downstream analysis and [SPRM](https://github.com/hubmapconsortium/sprm) is one such analytic pipeline that does clustering and quantification. Below are common questions and answers for imaging modalities:

<details><summary>Has the data been validated via ingest-validation-tools and confirmed to be viewable using Avivator (which loads data almost identically to what is in the portal)?</summary>
To this end, we should ask the TMC to follow the instructions below for viewing their data in Avivator to make sure it looks right (should only need to be done for a single representative file): https://github.com/hms-dbmi/viv/tree/master/tutorial

In the above instructions they should only need to a) run the bioformats2raw-raw2ometiff pipeline and then b) drag-and-drop or select the input file using the "CHOOSE A FILE" button on avivator.gehlenborglab.org. There is no need for a web server.

If there is a z or t stack to the data, ensure that each "stack" is uploaded as a single file.

If it is valid in these three senses (viewable in Avivator locally, passes `ingest-validation-tools`, and "stacks" are uploaded as single files), then ingestion may be done and pipeline processing may proceed.

</details>

<details><summary>Is there spot data?</summary>
Run the image pyramid pipeline + offsets on the appropriate imaging data.  We currently do not have a pipeline for visualizing spot data.  Create a new class that inherits from ViewConf to visualize the data (raw imaging + spot data) when such a pipeline is created.  If there is segmentation data coming from the TMC or elsewhere, then that will need to be both processed (via <a href="https://github.com/hubmapconsortium/portal-containers/tree/master/containers/sprm-to-anndata">sprm-to-anndata.cwl from portal-containers</a> or a different pipeline that ideally outputs zarr-backed AnnData) and visualized as well
</details>

<details><summary>Will Cytokit + SPRM be run?</summary>
If the answer is "yes," we should run <a href="https://github.com/hubmapconsortium/portal-containers/tree/master/containers/sprm-to-anndata">sprm-to-anndata.cwl from portal-containers</a> on the output of SPRM and the image pyramid pipeline + offsets on the output of Cytokit.  Attach the assay, if it is not automatically attached, in the portal backend to the `StitchedCytokitSPRMConf` class in <a href="https://github.com/hubmapconsortium/portal-ui/blob/9b49abda02e4f0579590289fc476eab23fa4cb02/context/app/api/vitessce_confs/assay_confs.py#L257-L290">context/app/api/vitessce_confs/assay_confs.py</a>
</details>

<details><summary>Will only SPRM be run (on non-Cytokit Segmentations)?</summary>
If the answer is "yes," we should run <a href="https://github.com/hubmapconsortium/portal-containers/tree/master/containers/sprm-to-anndata">sprm-to-anndata.cwl from portal-containers</a> from portal-containers on the output of SPRM and the image pyramid pipeline + offsets on the raw input data.  Attach the assay to a new class in the portal backend similar to <a href="https://github.com/hubmapconsortium/portal-ui/blob/9b49abda02e4f0579590289fc476eab23fa4cb02/context/app/api/vitessce_confs/assay_confs.py#L171-L197">StitchedCytokitSPRMConf</a> that wraps <a href="https://github.com/hubmapconsortium/portal-ui/blob/9b49abda02e4f0579590289fc476eab23fa4cb02/context/app/api/vitessce_confs/base_confs.py#L258-L313">SPRMAnnDataViewConfs</a> in <a href="https://github.com/hubmapconsortium/portal-ui/blob/9b49abda02e4f0579590289fc476eab23fa4cb02/context/app/api/vitessce_confs/assay_confs.py#L257-L290">context/app/api/vitessce_confs/assay_confs.py</a> if needed for multiple images in the same dataset.  Otherwise you may simply use SPRMAnnDataViewConf with the proper arguments.
</details>

<details><summary>For everything else...</summary>
Run the image pyramid pipeline + offsets on the raw input data.  Attach the assay to a new class in the portal backend similar to  SeqFISHViewConf or to the already existing ImagePyramidViewConf as needed in <a href="https://github.com/hubmapconsortium/portal-ui/blob/9b49abda02e4f0579590289fc476eab23fa4cb02/context/app/api/vitessce_confs/assay_confs.py#L257-L290">context/app/api/vitessce_confs/assay_confs.py</a> .  This will depend on how you want the layout to look to the end user.  See the <a href="https://github.com/hubmapconsortium/portal-ui/blob/9b49abda02e4f0579590289fc476eab23fa4cb02/context/app/api/vitessce_confs/assay_confs.py#L45-L95">SeqFISHViewConf</a> for an example of how hairy this can get.
</details>

## Sequencing Data

### xxxx-RNA-seq

Currently, `RNA-seq` data comes as `AnnData` `h5ad` files from [Matt's pipeline](https://github.com/hubmapconsortium/salmon-rnaseq). Vitessce is able to view `AnnData` directly when saved as `zarr`. In order to visualize the data, the following steps must be taken to alter the the incoming `AnnData` `h5ad` file:

1. Chunked correctly for optimal viewing
2. Marker genes located in the `obs` part of the store (so they may be visualized as pop-overs when hovered)
3. A filter for a subset of genes (corresponding to the marker genes) is stored so that it may be rendered as a heatmap.
4. Save this altered dataset as a `.zarr` store.

The steps for doing that are contained in a python script [here](https://github.com/hubmapconsortium/portal-containers/blob/dc568234c76017c7cd9644a4d15ef0f7b9d84e24/containers/anndata-to-ui/context/main.py#L17-L67) that is run after Matt's pipeline and the corresponding python visualization code for the portal backend is [here](https://github.com/hubmapconsortium/portal-ui/blob/9b49abda02e4f0579590289fc476eab23fa4cb02/context/app/api/vitessce_confs/assay_confs.py#L200-L238). Currently the portal backend cannot handle `slide-seq`, which is a spatially resolved `RNA-seq` assay, but its `ViewConf` class will look identical to the other [`AnnData`-backed `RNA-seq` datasets](https://github.com/hubmapconsortium/portal-ui/blob/9b49abda02e4f0579590289fc476eab23fa4cb02/context/app/api/vitessce_confs/assay_confs.py#L200-L238), except for an additional `spatial_polygon_obsm="X_spatial"` argument to the `AnnDataWrapper` as well as a `SPATIAL` vitessce component in the view config.

### xxxx-ATAC-seq

Currently only the (mis-named) [h5ad-to-arrow](https://github.com/hubmapconsortium/portal-containers/tree/master/containers/h5ad-to-arrow) pipeline is used to convert `h5ad` `AnnData` files to `json` that contains only the scatterplot results of the scanpy analysis. In the future, [`vitessce-python`](https://github.com/vitessce/vitessce-python/blob/c7edf9c0057fb1e5fc53e957c0657e61b0e43b90/vitessce/wrappers.py#L543) (or something similar) should be used as a new container to process the `SnapATAC`-backed (or other method of storage) peaks for visualization in Vitessce as [genomic profiles](http://beta.vitessce.io/docs/data-file-types/index.html#genomic-profileszarr). See [here](http://beta.vitessce.io/index.html?dataset=sn-atac-seq-hubmap-2020) for a demo what the final result will look like.

### SNARE-seq

`SNARE-seq` is a mix of the above two modalities and its processing and visualization is still TBD.
