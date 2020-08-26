#!/usr/bin/env python

import requests

es_docs = 10
es_url = 'https://search-api.stage.hubmapconsortium.org/portal/search'
assets_url = 'https://assets.stage.hubmapconsortium.org'

response = requests.post(
    es_url,
    json={
        "post_filter": {
            "exists": {"field": "files"}
        },
        "size": es_docs,
        "_source": ["uuid", "files"]
    },
    headers={
        'Content-Type': 'application/json'
    })

file_sizes = {}

for hit in response.json()['hits']['hits']:
    uuid = hit['_source']['uuid']
    for file_info in hit['_source']['files']:
        if file_info['rel_path'].endswith('.ome.tiff'):
            file_sizes[f'{assets_url}/{uuid}/{file_info["rel_path"]}'] = file_info['size']

print(file_sizes)