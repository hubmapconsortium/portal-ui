# APIs and Data Downloads

HuBMAP incorporates a wide range of data and metadata, developed by a number of separate teams,
so unfortunately there is no single "HuBMAP API". Depending on your needs, there are different places to begin.

## Data or metadata for a single dataset

On a dataset page you can:
- Download the backing JSON by appending `.json` to the URL, or clicking the document icon in the upper right.
- Download just the metadata as a key-value TSV by clicking the download button beside the "Metadata" section header.
- Download the data files through Globus, via a link in the "Files" section.

## Metadata for all donors, samples, or datasets

For metadata in TSV form, visit [`/api/v0/donors.tsv`](/api/v0/donors.tsv),
[`/api/v0/samples.tsv`](/api/v0/samples.tsv), or [`/api/v0/datasets.tsv`](/api/v0/datasets.tsv).
The datasets TSV has a large number of columns, because different assay types have different metadata fields.
If you are logged in and have sufficient privs, these will include unpublished data.

## Query metadata

To more flexibly query metadata, an [Elasticsearch endpoint](https://smart-api.info/ui/7aaf02b838022d564da776b03f357158) is available.
- If you haven't used it before, Elasticsearch query syntax is non-trivial.
- The response structure is not documented, and we do not guarantee the stability of responses.

## Create datasets

All API microservices developed by the IEC are documented at [SmartAPI](https://smart-api.info/registry?q=hubmap).
These APIs support our internal UIs, and are unlikely to be useful to most external users.

## Query gene expression data

It is possible to query gene expression data across datasets.
The [API](https://github.com/hubmapconsortium/cross_modality_query#usage) is complex and not well documented,
but there are [extensive examples](https://github.com/hubmapconsortium/hubmap-api-py-client#usage) for the Python client.

