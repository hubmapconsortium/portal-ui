---
title: Satija Cell Type Annotations
group_name: NYGC and UF
created_by_user_displayname: Rahul Satija
created_by_user_email: rsatija@nygenome.org
vitessce_conf: {
    "name": "Satija Cell Type Annotations",
    "layers": [
        {
            "name": "cells",
            "type": "CELLS",
            "url": "https://s3.amazonaws.com/vitessce-data/0.0.29/master_release/satija/7fd04d1aba61c35843dd2eb6a19d2545.cells.json"
        },
        {
            "name": "cell-sets",
            "type": "CELL-SETS",
            "url": "https://s3.amazonaws.com/vitessce-data/0.0.29/master_release/satija/7fd04d1aba61c35843dd2eb6a19d2545.cell-sets.json"
        }
    ],
    "public": true,
    "staticLayout": [
        {
            "component": "scatterplot",
            "props": {
                "mapping": "UMAP",
                "view": {
                    "zoom": 4,
                    "target": [8, 8, 0]
                }
            },
            "x": 0,
            "y": 0,
            "w": 7,
            "h": 2
        },
        {
            "component": "cellSets",
            "x": 7,
            "y": 0,
            "w": 5,
            "h": 1
        },
        {
            "component": "cellSetSizes",
            "x": 7,
            "y": 1,
            "w": 5,
            "h": 1
        }
    ]
}
---
<!-- TODO: Get a real description. -->
# Satija Showcase Header
Hierarchical Cell Type Annotations for Spleen Dataset
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit pellentesque pretium. 
Nulla id arcu vestibulum, congue erat vel, hendrerit turpis. Maecenas scelerisque nibh in imperdiet pretium. 
Etiam tortor erat, placerat eu felis non, vulputate fringilla metus. 
Nunc vitae lectus eget elit faucibus porta vel eget nibh. Nam pulvinar egestas eros, a cursus purus malesuada at. 
Sed diam nulla, molestie ac arcu non, maximus porta sapien. Quisque tincidunt, odio eu tristique tempor, nunc est tincidunt mauris, et consequat nibh augue vel justo. 
Nunc mattis vel nibh ut molestie.

## Subheader
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris blandit pellentesque pretium. 
Nulla id arcu vestibulum, congue erat vel, hendrerit turpis. Maecenas scelerisque nibh in imperdiet pretium. 
Etiam tortor erat, placerat eu felis non, vulputate fringilla metus. 
Nunc vitae lectus eget elit faucibus porta vel eget nibh. Nam pulvinar egestas eros, a cursus purus malesuada at. 
Sed diam nulla, molestie ac arcu non, maximus porta sapien. Quisque tincidunt, odio eu tristique tempor, nunc est tincidunt mauris, et consequat nibh augue vel justo. 
Nunc mattis vel nibh ut molestie.