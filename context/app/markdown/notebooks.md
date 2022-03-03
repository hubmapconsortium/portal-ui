# Notebooks

_This page may go away in the future!_

This is temporary home for notebooks which explore HuBMAP data.
In the future:
- Workspaces will be launched from various points in the HuBMAP Portal.
- Workspaces will run on HuBMAP compute resources, and have direct file system access to HuBMAP data.

## Single dataset

If a dataset has a visualization, you can get the corresponding notebook by appending `.ipynb` to the URL.
For example: [notebook for PAS stained kidney](/browse/dataset/664b8227e17ee2a35a504dd8c19c2531.ipynb)

If there is no visualization, a 404 will be returned.

## Multiple dataset

For now, multi-dataset notebooks can be created by appending the UUIDs as a query parameter:

- [Get metadata](/notebooks/get-metadata.ipynb?uuids=1234+5678)