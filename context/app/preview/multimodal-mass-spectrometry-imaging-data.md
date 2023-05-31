---
title: Multimodal Mass Spectrometry Imaging Data
group_name: Penn State University and Columbia University
created_by_user_displayname: Hua Tian
created_by_user_email: hut3@psu.edu
vitessce_conf:
  [
    {
      "version": "1.0.16",
      "uid": "3D Human Liver",
      "name": "3D Human Liver",
      "description": "",
      "datasets": [
        {
          "uid": "human-liver",
          "name": "Human dataset",
          "files": [
            {
              "fileType": "raster.json",
              "options": {
                "images": [
                  {
                    "metadata": {
                      "isBitmask": false
                    },
                    "name": "Human Liver",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_3d.raster.pyramid.ome.tiff"
                  }
                ],
                "renderLayers": [
                  "Human Liver"
                ],
                "schemaVersion": "0.0.2",
                "usePhysicalSizeScaling": true
              }
            }
          ]
        }
      ],
      "coordinationSpace": {
        "dataset": {
          "human": "human-liver"
        },
        "spatialAxisFixed": {
          "A": false
        },
        "spatialOrbitAxis": {
          "A": null
        },
        "spatialRotation": {
          "A": 0
        },
        "spatialRotationOrbit": {
          "A": -14.282115869017636
        },
        "spatialRotationX": {
          "A": -19.113264220037628
        },
        "spatialRotationY": {
          "A": null
        },
        "spatialRotationZ": {
          "A": null
        },
        "spatialTargetX": {
          "A": 494.0703579375883
        },
        "spatialTargetY": {
          "A": 358.7471084680066
        },
        "spatialTargetZ": {
          "A": 18.79732498306471
        },
        "spatialZoom": {
          "A": -0.7884025211167491
        },
        "spatialImageLayer": {
          "A": [
            {
              "channels": [
                {
                  "color": [
                    0,
                    0,
                    255
                  ],
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 3
                  },
                  "slider": [
                    0.942477822303772,
                    1.5707963705062866
                  ],
                  "visible": true
                },
                {
                  "color": [
                    0,
                    255,
                    0
                  ],
                  "selection": {
                    "c": 1,
                    "t": 0,
                    "z": 3
                  },
                  "slider": [
                    0.9142034876346589,
                    1.5707963705062866
                  ],
                  "visible": true
                },
                {
                  "color": [
                    255,
                    0,
                    255
                  ],
                  "selection": {
                    "c": 2,
                    "t": 0,
                    "z": 3
                  },
                  "slider": [
                    0.942477822303772,
                    1.5707963705062866
                  ],
                  "visible": true
                },
                {
                  "color": [
                    255,
                    255,
                    0
                  ],
                  "selection": {
                    "c": 3,
                    "t": 0,
                    "z": 3
                  },
                  "slider": [
                    0.9487610077857971,
                    1.5707963705062866
                  ],
                  "visible": true
                }
              ],
              "colormap": null,
              "domainType": "Min/Max",
              "index": 0,
              "opacity": 1,
              "renderingMode": "Maximum Intensity Projection",
              "resolution": 0,
              "transparentColor": null,
              "type": "raster",
              "use3d": true,
              "visible": true,
              "xSlice": [
                0,
                768
              ],
              "ySlice": [
                0,
                768
              ],
              "zSlice": [
                0,
                21.875
              ]
            }
          ]
        }
      },
      "layout": [
        {
          "component": "spatial",
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 12,
          "coordinationScopes": {
            "dataset": "human",
            "spatialAxisFixed": "A",
            "spatialOrbitAxis": "A",
            "spatialRotation": "A",
            "spatialRotationOrbit": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialZoom": "A",
            "spatialImageLayer": "A",
            "spatialSegmentationLayer": "A"
          }
        },
        {
          "component": "layerController",
          "x": 8,
          "y": 0,
          "w": 4,
          "h": 12,
          "coordinationScopes": {
            "dataset": "human",
            "spatialAxisFixed": "A",
            "spatialOrbitAxis": "A",
            "spatialRotation": "A",
            "spatialRotationOrbit": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialZoom": "A",
            "spatialImageLayer": "A",
            "spatialSegmentationLayer": "A"
          }
        }
      ],
      "initStrategy": "auto"
    },
    {
      "version": "1.0.16",
      "name": "3D Human Liver with annotations",
      "uid": "3D Human Liver with annotations",
      "description": "",
      "datasets": [
        {
          "uid": "human-liver-annot",
          "name": "Human dataset",
          "files": [
            {
              "fileType": "raster.json",
              "options": {
                "images": [
                  {
                    "metadata": {
                      "isBitmask": false
                    },
                    "name": "Human Liver",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_3d.raster.pyramid.ome.tiff"
                  },
                  {
                    "metadata": {
                      "isBitmask": true
                    },
                    "name": "Cell Segmentations (Sixth slice only)",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_topslice.cell_ids.ome.tiff"
                  }
                ],
                "renderLayers": [
                  "Human Liver",
                  "Cell Segmentations (Sixth slice only)"
                ],
                "schemaVersion": "0.0.2",
                "usePhysicalSizeScaling": false
              }
            },
            {
              "fileType": "anndata-cells.zarr",
              "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_topslice.h5ad.zarr",
              "options": {
                "mappings": {
                  "Lipid/metabolite-based t-SNE": {
                    "dims": [
                      0,
                      1
                    ],
                    "key": "obsm/X_lipmet_tsne"
                  },
                  "Protein-based t-SNE": {
                    "dims": [
                      0,
                      1
                    ],
                    "key": "obsm/X_protein_tsne"
                  }
                },
                "xy": "obsm/X_spatial"
              }
            },
            {
              "fileType": "anndata-cell-sets.zarr",
              "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_topslice.h5ad.zarr",
              "options": [
                {
                  "groupName": "Protein-based Clustering",
                  "setName": "obs/Protein Cluster"
                },
                {
                  "groupName": "Lipid/metabolite-based Clustering",
                  "setName": "obs/Lipmet Cluster"
                }
              ]
            },
            {
              "fileType": "anndata-expression-matrix.zarr",
              "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_topslice.h5ad.zarr",
              "options": {
                "geneAlias": "var/feature_name",
                "matrix": "layers/X_uint8"
              }
            }
          ]
        }
      ],
      "coordinationSpace": {
        "dataset": {
          "human": "human-liver-annot"
        },
        "embeddingType": {
          "A": "Protein-based t-SNE",
          "B": "Lipid/metabolite-based t-SNE"
        },
        "spatialAxisFixed": {
          "A": false
        },
        "spatialOrbitAxis": {
          "A": null
        },
        "spatialRotation": {
          "A": 0
        },
        "spatialRotationOrbit": {
          "A": -14.282115869017636
        },
        "spatialRotationX": {
          "A": -19.113264220037628
        },
        "spatialRotationY": {
          "A": null
        },
        "spatialRotationZ": {
          "A": null
        },
        "spatialTargetX": {
          "A": 494.0703579375883
        },
        "spatialTargetY": {
          "A": 358.7471084680066
        },
        "spatialTargetZ": {
          "A": 18.79732498306471
        },
        "spatialZoom": {
          "A": -0.7884025211167491
        },
        "spatialImageLayer": {
          "A": [
            {
              "channels": [
                {
                  "color": [
                    0,
                    0,
                    255
                  ],
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 6
                  },
                  "slider": [
                    0.942477822303772,
                    1.5707963705062866
                  ],
                  "visible": true
                },
                {
                  "color": [
                    0,
                    255,
                    0
                  ],
                  "selection": {
                    "c": 1,
                    "t": 0,
                    "z": 6
                  },
                  "slider": [
                    0.9142034876346589,
                    1.5707963705062866
                  ],
                  "visible": true
                },
                {
                  "color": [
                    255,
                    0,
                    255
                  ],
                  "selection": {
                    "c": 2,
                    "t": 0,
                    "z": 6
                  },
                  "slider": [
                    0.942477822303772,
                    1.5707963705062866
                  ],
                  "visible": true
                },
                {
                  "color": [
                    255,
                    255,
                    0
                  ],
                  "selection": {
                    "c": 3,
                    "t": 0,
                    "z": 6
                  },
                  "slider": [
                    0.9487610077857971,
                    1.5707963705062866
                  ],
                  "visible": true
                }
              ],
              "colormap": null,
              "domainType": "Min/Max",
              "index": 0,
              "opacity": 1,
              "renderingMode": "Maximum Intensity Projection",
              "transparentColor": null,
              "type": "raster",
              "use3d": false,
              "visible": true
            },
            {
              "channels": [
                {
                  "color": [
                    255,
                    255,
                    255
                  ],
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    2,
                    1998
                  ],
                  "visible": true
                }
              ],
              "colormap": null,
              "domainType": "Min/Max",
              "index": 1,
              "opacity": 1,
              "renderingMode": "Additive",
              "transparentColor": [
                0,
                0,
                0
              ],
              "type": "bitmask",
              "use3d": false,
              "visible": true
            }
          ]
        }
      },
      "layout": [
        {
          "component": "spatial",
          "x": 0,
          "y": 0,
          "w": 6,
          "h": 6,
          "coordinationScopes": {
            "dataset": "human",
            "spatialAxisFixed": "A",
            "spatialOrbitAxis": "A",
            "spatialRotation": "A",
            "spatialRotationOrbit": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialZoom": "A",
            "spatialImageLayer": "A",
            "spatialSegmentationLayer": "A"
          }
        },
        {
          "component": "layerController",
          "x": 6,
          "y": 0,
          "w": 2,
          "h": 6,
          "coordinationScopes": {
            "dataset": "human",
            "spatialAxisFixed": "A",
            "spatialOrbitAxis": "A",
            "spatialRotation": "A",
            "spatialRotationOrbit": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialZoom": "A",
            "spatialImageLayer": "A",
            "spatialSegmentationLayer": "A"
          }
        },
        {
          "component": "heatmap",
          "props": {
            "transpose": true,
            "variablesLabelOverride": "feature"
          },
          "x": 0,
          "y": 6,
          "w": 6,
          "h": 6,
          "coordinationScopes": {
            "dataset": "human"
          }
        },
        {
          "component": "obsSets",
          "x": 10,
          "y": 0,
          "w": 2,
          "h": 6,
          "coordinationScopes": {
            "dataset": "human"
          }
        },
        {
          "component": "featureList",
          "props": {
            "variablesLabelOverride": "feature"
          },
          "x": 8,
          "y": 0,
          "w": 2,
          "h": 6,
          "coordinationScopes": {
            "dataset": "human"
          }
        },
        {
          "component": "scatterplot",
          "x": 6,
          "y": 6,
          "w": 3,
          "h": 6,
          "coordinationScopes": {
            "dataset": "human",
            "embeddingType": "A"
          }
        },
        {
          "component": "scatterplot",
          "x": 9,
          "y": 6,
          "w": 3,
          "h": 6,
          "coordinationScopes": {
            "dataset": "human",
            "embeddingType": "B"
          }
        }
      ],
      "initStrategy": "auto"
    },
    {
      "version": "1.0.16",
      "name": "2D Mouse Liver",
      "uid": "2D Mouse Liver",
      "description": "",
      "datasets": [
        {
          "uid": "mouse-liver",
          "name": "Mouse dataset",
          "files": [
            {
              "fileType": "raster.json",
              "options": {
                "images": [
                  {
                    "metadata": {
                      "isBitmask": false
                    },
                    "name": "Mouse Liver",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.raster.pyramid.ome.tiff"
                  },
                  {
                    "metadata": {
                      "isBitmask": true
                    },
                    "name": "Cell Segmentations",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.cell_ids.ome.tiff"
                  }
                ],
                "renderLayers": [
                  "Mouse Liver",
                  "Cell Segmentations"
                ],
                "schemaVersion": "0.0.2",
                "usePhysicalSizeScaling": true
              }
            }
          ]
        }
      ],
      "coordinationSpace": {
        "dataset": {
          "mouse": "mouse-liver"
        },
        "spatialImageLayer": {
          "mouse": [
            {
              "channels": [
                {
                  "color": [
                    0,
                    0,
                    255
                  ],
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    1,
                    616
                  ],
                  "visible": true
                },
                {
                  "color": [
                    0,
                    255,
                    0
                  ],
                  "selection": {
                    "c": 1,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    1,
                    5916
                  ],
                  "visible": true
                },
                {
                  "color": [
                    255,
                    0,
                    255
                  ],
                  "selection": {
                    "c": 2,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    1,
                    13273
                  ],
                  "visible": true
                },
                {
                  "color": [
                    255,
                    255,
                    0
                  ],
                  "selection": {
                    "c": 3,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    25,
                    57627
                  ],
                  "visible": true
                }
              ],
              "colormap": null,
              "domainType": "Min/Max",
              "index": 0,
              "opacity": 1,
              "renderingMode": "Additive",
              "transparentColor": null,
              "type": "raster",
              "use3d": false,
              "visible": true
            },
            {
              "channels": [
                {
                  "color": [
                    255,
                    255,
                    255
                  ],
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    2,
                    957
                  ],
                  "visible": true
                }
              ],
              "colormap": null,
              "domainType": "Min/Max",
              "index": 1,
              "opacity": 1,
              "renderingMode": "Additive",
              "transparentColor": [
                0,
                0,
                0
              ],
              "type": "bitmask",
              "use3d": false,
              "visible": false
            }
          ]
        }
      },
      "layout": [
        {
          "component": "spatial",
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 12,
          "coordinationScopes": {
            "dataset": "mouse",
            "spatialImageLayer": "mouse"
          }
        },
        {
          "component": "description",
          "x": 8,
          "y": 9,
          "w": 4,
          "h": 3,
          "coordinationScopes": {
            "dataset": "mouse",
            "spatialImageLayer": "mouse"
          }
        },
        {
          "component": "layerController",
          "x": 8,
          "y": 0,
          "w": 4,
          "h": 9,
          "coordinationScopes": {
            "dataset": "mouse",
            "spatialImageLayer": "mouse"
          }
        }
      ],
      "initStrategy": "auto"
    },
    {
      "version": "1.0.16",
      "name": "2D Mouse Liver with annotations",
      "uid": "2D Mouse Liver with annotations",
      "description": "",
      "datasets": [
        {
          "uid": "mouse-liver-annot",
          "name": "Mouse dataset",
          "files": [
            {
              "fileType": "raster.json",
              "options": {
                "images": [
                  {
                    "metadata": {
                      "isBitmask": false
                    },
                    "name": "Mouse Liver",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.raster.pyramid.ome.tiff"
                  },
                  {
                    "metadata": {
                      "isBitmask": true
                    },
                    "name": "Cell Segmentations",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.cell_ids.ome.tiff"
                  }
                ],
                "renderLayers": [
                  "Mouse Liver",
                  "Cell Segmentations"
                ],
                "schemaVersion": "0.0.2",
                "usePhysicalSizeScaling": true
              }
            },
            {
              "fileType": "anndata-cells.zarr",
              "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.h5ad.zarr",
              "options": {
                "mappings": {
                  "Lipid/metabolite-based t-SNE": {
                    "dims": [
                      0,
                      1
                    ],
                    "key": "obsm/X_lipmet_tsne"
                  },
                  "Protein-based t-SNE": {
                    "dims": [
                      0,
                      1
                    ],
                    "key": "obsm/X_protein_tsne"
                  }
                },
                "xy": "obsm/X_spatial"
              }
            },
            {
              "fileType": "anndata-cell-sets.zarr",
              "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.h5ad.zarr",
              "options": [
                {
                  "groupName": "Protein-based Clustering",
                  "setName": "obs/Protein Cluster"
                },
                {
                  "groupName": "Lipid/metabolite-based Clustering",
                  "setName": "obs/Lipmet Cluster"
                }
              ]
            },
            {
              "fileType": "anndata-expression-matrix.zarr",
              "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.h5ad.zarr",
              "options": {
                "geneAlias": "var/feature_name",
                "matrix": "layers/X_uint8"
              }
            }
          ]
        }
      ],
      "coordinationSpace": {
        "dataset": {
          "mouse": "mouse-liver-annot"
        },
        "embeddingType": {
          "A": "Protein-based t-SNE",
          "B": "Lipid/metabolite-based t-SNE"
        },
        "spatialImageLayer": {
          "A": [
            {
              "channels": [
                {
                  "color": [
                    0,
                    0,
                    255
                  ],
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    1,
                    616
                  ],
                  "visible": true
                },
                {
                  "color": [
                    0,
                    255,
                    0
                  ],
                  "selection": {
                    "c": 1,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    1,
                    5916
                  ],
                  "visible": true
                },
                {
                  "color": [
                    255,
                    0,
                    255
                  ],
                  "selection": {
                    "c": 2,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    1,
                    13273
                  ],
                  "visible": true
                },
                {
                  "color": [
                    255,
                    255,
                    0
                  ],
                  "selection": {
                    "c": 3,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    25,
                    57627
                  ],
                  "visible": true
                }
              ],
              "colormap": null,
              "domainType": "Min/Max",
              "index": 0,
              "opacity": 1,
              "renderingMode": "Additive",
              "transparentColor": null,
              "type": "raster",
              "use3d": false,
              "visible": true
            },
            {
              "channels": [
                {
                  "color": [
                    255,
                    255,
                    255
                  ],
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 0
                  },
                  "slider": [
                    2,
                    957
                  ],
                  "visible": true
                }
              ],
              "colormap": null,
              "domainType": "Min/Max",
              "index": 1,
              "opacity": 1,
              "renderingMode": "Additive",
              "transparentColor": [
                0,
                0,
                0
              ],
              "type": "bitmask",
              "use3d": false,
              "visible": true
            }
          ]
        }
      },
      "layout": [
        {
          "component": "spatial",
          "x": 0,
          "y": 0,
          "w": 6,
          "h": 6,
          "coordinationScopes": {
            "dataset": "mouse",
            "spatialAxisFixed": "A",
            "spatialOrbitAxis": "A",
            "spatialRotation": "A",
            "spatialRotationOrbit": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialZoom": "A",
            "spatialImageLayer": "A",
            "spatialSegmentationLayer": "A"
          }
        },
        {
          "component": "layerController",
          "x": 6,
          "y": 0,
          "w": 2,
          "h": 6,
          "coordinationScopes": {
            "dataset": "mouse",
            "spatialAxisFixed": "A",
            "spatialOrbitAxis": "A",
            "spatialRotation": "A",
            "spatialRotationOrbit": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialZoom": "A",
            "spatialImageLayer": "A",
            "spatialSegmentationLayer": "A"
          }
        },
        {
          "component": "heatmap",
          "props": {
            "transpose": true,
            "variablesLabelOverride": "feature"
          },
          "x": 0,
          "y": 6,
          "w": 6,
          "h": 6,
          "coordinationScopes": {
            "dataset": "mouse"
          }
        },
        {
          "component": "obsSets",
          "x": 10,
          "y": 0,
          "w": 2,
          "h": 6,
          "coordinationScopes": {
            "dataset": "mouse"
          }
        },
        {
          "component": "featureList",
          "props": {
            "variablesLabelOverride": "feature"
          },
          "x": 8,
          "y": 0,
          "w": 2,
          "h": 6,
          "coordinationScopes": {
            "dataset": "mouse"
          }
        },
        {
          "component": "scatterplot",
          "x": 6,
          "y": 6,
          "w": 3,
          "h": 6,
          "coordinationScopes": {
            "dataset": "mouse",
            "embeddingType": "A"
          }
        },
        {
          "component": "scatterplot",
          "x": 9,
          "y": 6,
          "w": 3,
          "h": 6,
          "coordinationScopes": {
            "dataset": "mouse",
            "embeddingType": "B"
          }
        }
      ],
      "initStrategy": "auto"
    }
  ]
---

# Description

The liver atlas demonstrates the first 2D/3D visualization of integrated spatial omics (metabolomics, lipidomics and proteomics) in different types of individual cells. With the pioneering work in cryogenic water cluster ion beam secondary ion mass spectrometry imaging \[(H<sub>2</sub>O)<sub>n</sub>-GCIB-SIMS\] and desorption electrospray ionization (DESI) imaging, we can now view several classes of biomolecules (e.g., 200 metabolites/lipids and 20 cell-type/structure-specific proteins) in the same cells at the spatial resolution of 1 µm. This provides a more comprehensive understanding of cellular/molecular heterogeneity, metabolic states of cell types, and pathway coordination. We found for the first time that lipids and metabolites can classify metabolic zones and cell types beyond histological and protein-marker annotation. We anticipate the multimodal mass spectrometry imaging workflow to dissect the multilevel heterogeneities and health/disease continuum for precision therapies.

<!--
## Experimental Details

TODO

## Protocols

**Overall**: [dx.doi.org/10.17504/TODO](https://dx.doi.org/10.17504/TODO)

-->

## Contributors

- Hua Tian
- Presha Rajbhandari
- Jay Tarolli
- Aubrianna M. Decker
- Taruna V. Neelakantan
- Tina Angerer
- Fereshteh Zandkarimi
- Jacob Daniels
- Helen Remotti
- Gilles Frache
- Nicholas Winograd
- Brent R. Stockwell

