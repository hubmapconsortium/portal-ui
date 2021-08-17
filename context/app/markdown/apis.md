# APIs and Data Downloads

HuBMAP incorporates a wide range of data and metadata, developed by a number of separate teams,
and there is no single "HuBMAP API". Depending on your needs, there are different places to begin.

## Data or metadata for a single dataset

On a dataset page you can:
- Download the backing JSON by appending `.json` to the URL, or clicking the document icon in the upper right.
- Download just the metadata as a key-value TSV by clicking the download button beside the "Metadata" section header.
- Download the data files through Globus, via a link in the "Files" section.

## Metadata for all donors, samples, or datasets

For metadata in TSV form, visit [`/api/v0/donors.tsv`](/api/v0/donors.tsv),
[`/api/v0/samples.tsv`](/api/v0/samples.tsv), or [`/api/v0/datasets.tsv`](/api/v0/datasets.tsv).
The datasets TSV has a large number of columns, because different assay types have different metadata fields.
If you are logged in and have sufficient access privileges, these will include unpublished data.

## Query metadata

To more flexibly query metadata, the [HuBMAP Search API](https://smart-api.info/ui/7aaf02b838022d564da776b03f357158) is available.
This web service is a thin wrapper around the [Elasticsearch `_search` method](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html).
- Elasticsearch query syntax is non-trivial and only recommended for expert users.
- The response structure is not documented, and we do not guarantee the stability of responses.

## Edit HuBMAP datasets, samples, and donors

[All API microservices](/docs/apis) developed by the IEC are documented at
[SmartAPI](https://smart-api.info/registry?q=hubmap).
These APIs support our internal UIs, and are likely of limited value to most external users.

## Query gene expression data

It is possible to query gene expression data across datasets.
The [API](https://github.com/hubmapconsortium/cross_modality_query#usage) is complex,
but there are [extensive examples](https://github.com/hubmapconsortium/hubmap-api-py-client#usage) for the Python client.

