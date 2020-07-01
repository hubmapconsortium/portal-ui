# HuBMAP Pipelines
## Assay-Specific
### [CODEX](https://docs.google.com/document/d/1NJqJmM6ecstE8g3waWDR4n_uQ7RoKkBxT1Kes1Otcag/edit#heading=h.ca5mry4plx6)
The HuBMAP Consortium CODEX pipeline uses [Cytokit](https://bmcbioinformatics.biomedcentral.com/articles/10.1186/s12859-019-3055-3) to process CODEX datasets from raw data to OME-TIFF compliant segmentation results and compiled antigen fluorescence images.
References: 

- [Git Hub](https://github.com/hubmapconsortium/codex-pipeline)

### [SPRM – Spatial Process & Relationship Modeling](https://docs.google.com/document/d/1c7UR0Pe1newpVhQY2HEFkfV8O7GAj9Vk4XnuSiSnDeY/edit#)
SPRM is a statistical modeling program used to calculate a range of descriptors from multichannel images. It can be used for any type of multichannel 2D or 3D image (e.g., CODEX, IMS).
- Git Hub: none currently available

### [Single-cell RNA sequencing](https://docs.google.com/document/d/14Fu32w_AjyOzT82m99DzZz5iUEJa5v98IBPns5vlizo/edit?usp=sharing)

HuBMAP single-cell RNA-seq data sets are processed with a two-stage pipeline, using [Salmon](https://combine-lab.github.io/salmon/) for transcript quantification and [Scanpy](https://icb-scanpy.readthedocs-hosted.com/en/stable/) for secondary analysis. This pipeline is implemented in CWL, calling command-line tools encapsulated in Docker containers.
- [Git Hub](https://github.com/hubmapconsortium/salmon-rnaseq)

### [Single-cell ATAC-seq](https://docs.google.com/document/d/1qNy8DQJ4Xn431huHyTydRJCQSF68Cmu06tZtZnAKW6s/edit)
The HuBMAP Consortium uses a three-stage pipeline for scATAC-seq data sets, composed of [SnapTools](https://github.com/r3fang/SnapTools), [SnapATAC](https://github.com/r3fang/SnapATAC), and [chromVAR](https://bioconductor.org/packages/release/bioc/html/chromVAR.html). This pipeline is written in CWL, calling command-line tools encapsulated in Docker containers.
- [Git Hub](https://github.com/hubmapconsortium/sc-atac-seq-pipeline)

## Intra-Portal Transformation
### [h5ad-to-arrow](https://github.com/hubmapconsortium/portal-containers/tree/master/containers/h5ad-to-arrow)
This container translates anndata's h5ad to Apache Arrow, as well as CSV, and Vitessce JSON which conforms to our schemas.

### [ome-tiff-offsets](https://github.com/hubmapconsortium/portal-containers/tree/master/containers/ome-tiff-offsets)
This docker container creates a JSON list of byte offsets for each TIFF from an input directory. This makes visualization much more efficient as we can request specific IFDs and their tiles more efficiently

### [ome-tiff-tiler](https://github.com/hubmapconsortium/portal-containers/tree/master/containers/ome-tiff-tiler)

This docker container contains a tiler based on bioformats2raw and  raw2ometiff. The CWL allows for an input directory  `-i`  and optional bindings for workers with a  `-w`  and then  `rgb`  with  `-r`. The input is a directory of  `OME-TIFF`  files and the output is a  `OME-TIFF`  pyramid and a  `n5`  directory for quicker local analysis.

```
  -i ./path/to/directory    The input directory containing OME-TIFF files.
  -w 6                      (Optional) bindings for number of workers, with the default as the available number of cores
  -r                        (Optional) Flag for RGB images
```

### [scatac-csv-to-arrow](https://github.com/hubmapconsortium/portal-containers/tree/master/containers/scatac-csv-to-arrow)
This container takes the CSV from the HuBMAP scATAC-seq pipeline to Apache Arrow, as well as normalized CSV, and Vitessce JSON which conforms to our schemas.

### [sprm-to-json](https://github.com/hubmapconsortium/portal-containers/tree/master/containers/sprm-to-json)
This container takes SPRM output CSVs and converts them into Vitessce JSON which conforms to our schemas.
