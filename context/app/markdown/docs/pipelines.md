# HuBMAP Pipelines

### [CODEX](https://docs.google.com/document/d/1NJqJmM6ecstE8g3waWDR4n_uQ7RoKkBxT1Kes1Otcag/edit#heading=h.ca5mry4plx6)

The HuBMAP Consortium CODEX pipeline uses [Cytokit](https://bmcbioinformatics.biomedcentral.com/articles/10.1186/s12859-019-3055-3) to process CODEX datasets from raw data to OME-TIFF compliant segmentation results and compiled antigen fluorescence images.

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


### [Bulk RNA sequencing](https://docs.google.com/document/d/1DIQJBM5icoKNEfafQA6Aaio2sAjui3NfO1fkMAThdOU/edit?usp=sharing)

HuBMAP single-cell RNA-seq data sets are processed using [Salmon](https://combine-lab.github.io/salmon/) for transcript quantification. This pipeline is implemented in CWL, calling command-line tools encapsulated in Docker containers.

- [Git Hub](https://github.com/hubmapconsortium/salmon-rnaseq)


### [Bulk ATAC-seq](https://docs.google.com/document/d/1Jwm5V-A3j1fynriwo9Ec9QWEODovR14zUmaaUNf1Pq0/edit?usp=sharing)

The HuBMAP Consortium uses a two-stage pipeline for scATAC-seq data sets, composed of [SnapTools](https://github.com/r3fang/SnapTools) and [MACS2](https://github.com/macs3-project/MACS) This pipeline is written in CWL, calling command-line tools encapsulated in Docker containers.

- [Git Hub](https://github.com/hubmapconsortium/sc-atac-seq-pipeline)
