---
title: Multimodal Mass Spectrometry Imaging Data
group_name: Penn State University and Columbia University
created_by_user_displayname: Hua Tian
created_by_user_email: hut3@psu.edu
vitessce_conf:
  [
    {
      "version": "1.0.7",
      "name": "3D Human Liver",
      "description": "",
      "datasets": [
        {
          "uid": "human-liver",
          "name": "Human dataset",
          "files": [
            {
              "type": "raster",
              "fileType": "raster.json",
              "options": {
                "schemaVersion": "0.0.2",
                "usePhysicalSizeScaling": true,
                "images": [
                  {
                    "name": "Human Liver",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_3d.raster.pyramid.ome.tiff",
                    "metadata": {
                      "isBitmask": false
                    }
                  }
                ],
                "renderLayers": [
                  "Human Liver"
                ]
              }
            }
          ]
        }
      ],
      "coordinationSpace": {
        "dataset": {
          "human": "human-liver"
        },
        "spatialZoom": {
          "A": -0.7884025211167491
        },
        "spatialRotation": {
          "A": 0
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
        "spatialRotationX": {
          "A": -19.113264220037628
        },
        "spatialRotationY": {
          "A": null
        },
        "spatialRotationZ": {
          "A": null
        },
        "spatialRotationOrbit": {
          "A": -14.282115869017636
        },
        "spatialOrbitAxis": {
          "A": null
        },
        "spatialAxisFixed": {
          "A": false
        },
        "spatialRasterLayers": {
          "A": [
            {
              "type": "raster",
              "index": 0,
              "visible": true,
              "colormap": null,
              "opacity": 1,
              "domainType": "Min/Max",
              "transparentColor": null,
              "renderingMode": "Maximum Intensity Projection",
              "use3d": true,
              "channels": [
                {
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 3
                  },
                  "color": [
                    0,
                    0,
                    255
                  ],
                  "visible": true,
                  "slider": [
                    0.942477822303772,
                    1.5707963705062866
                  ]
                },
                {
                  "selection": {
                    "c": 1,
                    "t": 0,
                    "z": 3
                  },
                  "color": [
                    0,
                    255,
                    0
                  ],
                  "visible": true,
                  "slider": [
                    0.9142034876346589,
                    1.5707963705062866
                  ]
                },
                {
                  "selection": {
                    "c": 2,
                    "t": 0,
                    "z": 3
                  },
                  "color": [
                    255,
                    0,
                    255
                  ],
                  "visible": true,
                  "slider": [
                    0.942477822303772,
                    1.5707963705062866
                  ]
                },
                {
                  "selection": {
                    "c": 3,
                    "t": 0,
                    "z": 3
                  },
                  "color": [
                    255,
                    255,
                    0
                  ],
                  "visible": true,
                  "slider": [
                    0.9487610077857971,
                    1.5707963705062866
                  ]
                }
              ],
              "resolution": 0,
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
          "coordinationScopes": {
            "dataset": "human",
            "spatialZoom": "A",
            "spatialRotation": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialRotationOrbit": "A",
            "spatialOrbitAxis": "A",
            "spatialAxisFixed": "A",
            "spatialRasterLayers": "A",
            "spatialCellsLayer": "A"
          },
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 12
        },
        {
          "component": "layerController",
          "coordinationScopes": {
            "dataset": "human",
            "spatialZoom": "A",
            "spatialRotation": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialRotationOrbit": "A",
            "spatialOrbitAxis": "A",
            "spatialAxisFixed": "A",
            "spatialRasterLayers": "A",
            "spatialCellsLayer": "A"
          },
          "x": 8,
          "y": 0,
          "w": 4,
          "h": 12
        }
      ],
      "initStrategy": "auto"
    },
    {
      "version": "1.0.7",
      "name": "3D Human Liver with annotations",
      "description": "",
      "datasets": [
        {
          "uid": "human-liver-annot",
          "name": "Human dataset",
          "files": [
            {
              "type": "raster",
              "fileType": "raster.json",
              "options": {
                "schemaVersion": "0.0.2",
                "usePhysicalSizeScaling": false,
                "images": [
                  {
                    "name": "Human Liver",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_3d.raster.pyramid.ome.tiff",
                    "metadata": {
                      "isBitmask": false
                    }
                  },
                  {
                    "name": "Cell Segmentations (Sixth slice only)",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_topslice.cell_ids.ome.tiff",
                    "metadata": {
                      "isBitmask": true
                    }
                  }
                ],
                "renderLayers": [
                  "Human Liver",
                  "Cell Segmentations (Sixth slice only)"
                ]
              }
            },
            {
              "type": "cells",
              "fileType": "anndata-cells.zarr",
              "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_topslice.h5ad.zarr",
              "options": {
                "xy": "obsm/X_spatial",
                "mappings": {
                  "Protein-based t-SNE": {
                    "key": "obsm/X_protein_tsne",
                    "dims": [0, 1]
                  },
                  "Lipid/metabolite-based t-SNE": {
                    "key": "obsm/X_lipmet_tsne",
                    "dims": [0, 1]
                  }
                }
              }
            },
            {
              "type": "cell-sets",
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
              "type": "expression-matrix",
              "fileType": "anndata-expression-matrix.zarr",
              "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/human_topslice.h5ad.zarr",
              "options": {
                "matrix": "layers/X_uint8",
                "geneAlias": "var/feature_name"
              }
            }
          ]
        }
      ],
      "coordinationSpace": {
        "dataset": {
          "human": "human-liver-annot"
        },
        "spatialZoom": {
          "A": -0.7884025211167491
        },
        "spatialRotation": {
          "A": 0
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
        "spatialRotationX": {
          "A": -19.113264220037628
        },
        "spatialRotationY": {
          "A": null
        },
        "spatialRotationZ": {
          "A": null
        },
        "spatialRotationOrbit": {
          "A": -14.282115869017636
        },
        "spatialOrbitAxis": {
          "A": null
        },
        "spatialAxisFixed": {
          "A": false
        },
        "spatialRasterLayers": {
          "A": [
            {
              "type": "raster",
              "index": 0,
              "visible": true,
              "colormap": null,
              "opacity": 1,
              "domainType": "Min/Max",
              "transparentColor": null,
              "renderingMode": "Maximum Intensity Projection",
              "use3d": false,
              "channels": [
                {
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 6
                  },
                  "color": [
                    0,
                    0,
                    255
                  ],
                  "visible": true,
                  "slider": [
                    0.942477822303772,
                    1.5707963705062866
                  ]
                },
                {
                  "selection": {
                    "c": 1,
                    "t": 0,
                    "z": 6
                  },
                  "color": [
                    0,
                    255,
                    0
                  ],
                  "visible": true,
                  "slider": [
                    0.9142034876346589,
                    1.5707963705062866
                  ]
                },
                {
                  "selection": {
                    "c": 2,
                    "t": 0,
                    "z": 6
                  },
                  "color": [
                    255,
                    0,
                    255
                  ],
                  "visible": true,
                  "slider": [
                    0.942477822303772,
                    1.5707963705062866
                  ]
                },
                {
                  "selection": {
                    "c": 3,
                    "t": 0,
                    "z": 6
                  },
                  "color": [
                    255,
                    255,
                    0
                  ],
                  "visible": true,
                  "slider": [
                    0.9487610077857971,
                    1.5707963705062866
                  ]
                }
              ]
            },
            {
              "channels": [
                {
                  "color": [255, 255, 255],
                  "selection": { "c": 0, "t": 0, "z": 0 },
                  "slider": [2, 1998],
                  "visible": true
                }
              ],
              "colormap": null,
              "domainType": "Min/Max",
              "index": 1,
              "opacity": 1,
              "renderingMode": "Additive",
              "transparentColor": [0, 0, 0],
              "type": "bitmask",
              "use3d": false,
              "visible": true
            }
          ]
        },
        "embeddingType": {
          "A": "Protein-based t-SNE",
          "B": "Lipid/metabolite-based t-SNE"
        }
      },
      "layout": [
        {
          "component": "spatial",
          "coordinationScopes": {
            "dataset": "human",
            "spatialZoom": "A",
            "spatialRotation": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialRotationOrbit": "A",
            "spatialOrbitAxis": "A",
            "spatialAxisFixed": "A",
            "spatialRasterLayers": "A",
            "spatialCellsLayer": "A"
          },
          "x": 0,
          "y": 0,
          "w": 6,
          "h": 6
        },
        {
          "component": "layerController",
          "coordinationScopes": {
            "dataset": "human",
            "spatialZoom": "A",
            "spatialRotation": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialRotationOrbit": "A",
            "spatialOrbitAxis": "A",
            "spatialAxisFixed": "A",
            "spatialRasterLayers": "A",
            "spatialCellsLayer": "A"
          },
          "x": 6,
          "y": 0,
          "w": 2,
          "h": 6
        },
        {
          "component": "heatmap",
          "coordinationScopes": {
            "dataset": "human"
          },
          "props": {
            "transpose": true,
            "variablesLabelOverride": "feature"
          },
          "x": 0,
          "y": 6,
          "w": 6,
          "h": 6
        },
        {
          "component": "cellSets",
          "coordinationScopes": {
            "dataset": "human"
          },
          "x": 10,
          "y": 0,
          "w": 2,
          "h": 6
        },
        {
          "component": "genes",
          "coordinationScopes": {
            "dataset": "human"
          },
          "props": {
            "variablesLabelOverride": "feature"
          },
          "x": 8,
          "y": 0,
          "w": 2,
          "h": 6
        },
        {
          "component": "scatterplot",
          "coordinationScopes": {
            "dataset": "human",
            "embeddingType": "A"
          },
          "x": 6,
          "y": 6,
          "w": 3,
          "h": 6
        },
        {
          "component": "scatterplot",
          "coordinationScopes": {
            "dataset": "human",
            "embeddingType": "B"
          },
          "x": 9,
          "y": 6,
          "w": 3,
          "h": 6
        }
      ],
      "initStrategy": "auto"
    },
    {
      "version": "1.0.7",
      "name": "2D Mouse Liver",
      "description": "",
      "datasets": [
        {
          "uid": "mouse-liver",
          "name": "Mouse dataset",
          "files": [
            {
              "type": "raster",
              "fileType": "raster.json",
              "options": {
                "schemaVersion": "0.0.2",
                "usePhysicalSizeScaling": true,
                "images": [
                  {
                    "name": "Mouse Liver",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.raster.pyramid.ome.tiff",
                    "metadata": {
                      "isBitmask": false
                    }
                  },
                  {
                    "name": "Cell Segmentations",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.cell_ids.ome.tiff",
                    "metadata": {
                      "isBitmask": true
                    }
                  }
                ],
                "renderLayers": [
                  "Mouse Liver",
                  "Cell Segmentations"
                ]
              }
            }
          ]
        }
      ],
      "coordinationSpace": {
        "dataset": {
          "mouse": "mouse-liver"
        },
        "spatialRasterLayers": {
          "mouse": [
            {
              "type": "raster",
              "index": 0,
              "visible": true,
              "colormap": null,
              "opacity": 1,
              "domainType": "Min/Max",
              "transparentColor": null,
              "renderingMode": "Additive",
              "use3d": false,
              "channels": [
                {
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 0
                  },
                  "color": [
                    0,
                    0,
                    255
                  ],
                  "visible": true,
                  "slider": [
                    1,
                    616
                  ]
                },
                {
                  "selection": {
                    "c": 1,
                    "t": 0,
                    "z": 0
                  },
                  "color": [
                    0,
                    255,
                    0
                  ],
                  "visible": true,
                  "slider": [
                    1,
                    5916
                  ]
                },
                {
                  "selection": {
                    "c": 2,
                    "t": 0,
                    "z": 0
                  },
                  "color": [
                    255,
                    0,
                    255
                  ],
                  "visible": true,
                  "slider": [
                    1,
                    13273
                  ]
                },
                {
                  "selection": {
                    "c": 3,
                    "t": 0,
                    "z": 0
                  },
                  "color": [
                    255,
                    255,
                    0
                  ],
                  "visible": true,
                  "slider": [
                    25,
                    57627
                  ]
                }
              ]
            },
            {
              "type": "bitmask",
              "index": 1,
              "visible": false,
              "colormap": null,
              "opacity": 1,
              "domainType": "Min/Max",
              "transparentColor": [
                0,
                0,
                0
              ],
              "renderingMode": "Additive",
              "use3d": false,
              "channels": [
                {
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 0
                  },
                  "color": [
                    255,
                    255,
                    255
                  ],
                  "visible": true,
                  "slider": [
                    2,
                    957
                  ]
                }
              ]
            }
          ]
        }
      },
      "layout": [
        {
          "component": "spatial",
          "coordinationScopes": {
            "dataset": "mouse",
            "spatialRasterLayers": "mouse"
          },
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 12
        },
        {
          "component": "description",
          "coordinationScopes": {
            "dataset": "mouse",
            "spatialRasterLayers": "mouse"
          },
          "x": 8,
          "y": 9,
          "w": 4,
          "h": 3
        },
        {
          "component": "layerController",
          "coordinationScopes": {
            "dataset": "mouse",
            "spatialRasterLayers": "mouse"
          },
          "x": 8,
          "y": 0,
          "w": 4,
          "h": 9
        }
      ],
      "initStrategy": "auto"
    },
    {
      "version": "1.0.7",
      "name": "2D Mouse Liver with annotations",
      "description": "",
      "datasets": [
        {
          "uid": "mouse-liver-annot",
          "name": "Mouse dataset",
          "files": [
            {
              "type": "raster",
              "fileType": "raster.json",
              "options": {
                "schemaVersion": "0.0.2",
                "usePhysicalSizeScaling": true,
                "images": [
                  {
                    "name": "Mouse Liver",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.raster.pyramid.ome.tiff",
                    "metadata": {
                      "isBitmask": false
                    }
                  },
                  {
                    "name": "Cell Segmentations",
                    "type": "ome-tiff",
                    "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.cell_ids.ome.tiff",
                    "metadata": {
                      "isBitmask": true
                    }
                  }
                ],
                "renderLayers": [
                  "Mouse Liver",
                  "Cell Segmentations"
                ]
              }
            },
            {
              "type": "cells",
              "fileType": "anndata-cells.zarr",
              "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.h5ad.zarr",
              "options": {
                "xy": "obsm/X_spatial",
                "mappings": {
                  "Protein-based t-SNE": {
                    "key": "obsm/X_protein_tsne",
                    "dims": [0, 1]
                  },
                  "Lipid/metabolite-based t-SNE": {
                    "key": "obsm/X_lipmet_tsne",
                    "dims": [0, 1]
                  }
                }
              }
            },
            {
              "type": "cell-sets",
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
              "type": "expression-matrix",
              "fileType": "anndata-expression-matrix.zarr",
              "url": "https://storage.googleapis.com/vitessce-data/0.0.31/master_release/tian/mouse_2d.h5ad.zarr",
              "options": {
                "matrix": "layers/X_uint8",
                "geneAlias": "var/feature_name"
              }
            }
          ]
        }
      ],
      "coordinationSpace": {
        "dataset": {
          "mouse": "mouse-liver-annot"
        },
        "spatialRasterLayers": {
          "A": [
            {
              "type": "raster",
              "index": 0,
              "visible": true,
              "colormap": null,
              "opacity": 1,
              "domainType": "Min/Max",
              "transparentColor": null,
              "renderingMode": "Additive",
              "use3d": false,
              "channels": [
                {
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 0
                  },
                  "color": [
                    0,
                    0,
                    255
                  ],
                  "visible": true,
                  "slider": [
                    1,
                    616
                  ]
                },
                {
                  "selection": {
                    "c": 1,
                    "t": 0,
                    "z": 0
                  },
                  "color": [
                    0,
                    255,
                    0
                  ],
                  "visible": true,
                  "slider": [
                    1,
                    5916
                  ]
                },
                {
                  "selection": {
                    "c": 2,
                    "t": 0,
                    "z": 0
                  },
                  "color": [
                    255,
                    0,
                    255
                  ],
                  "visible": true,
                  "slider": [
                    1,
                    13273
                  ]
                },
                {
                  "selection": {
                    "c": 3,
                    "t": 0,
                    "z": 0
                  },
                  "color": [
                    255,
                    255,
                    0
                  ],
                  "visible": true,
                  "slider": [
                    25,
                    57627
                  ]
                }
              ]
            },
            {
              "type": "bitmask",
              "index": 1,
              "visible": true,
              "colormap": null,
              "opacity": 1,
              "domainType": "Min/Max",
              "transparentColor": [
                0,
                0,
                0
              ],
              "renderingMode": "Additive",
              "use3d": false,
              "channels": [
                {
                  "selection": {
                    "c": 0,
                    "t": 0,
                    "z": 0
                  },
                  "color": [
                    255,
                    255,
                    255
                  ],
                  "visible": true,
                  "slider": [
                    2,
                    957
                  ]
                }
              ]
            }
          ]
        },
        "embeddingType": {
          "A": "Protein-based t-SNE",
          "B": "Lipid/metabolite-based t-SNE"
        }
      },
      "layout": [
        {
          "component": "spatial",
          "coordinationScopes": {
            "dataset": "mouse",
            "spatialZoom": "A",
            "spatialRotation": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialRotationOrbit": "A",
            "spatialOrbitAxis": "A",
            "spatialAxisFixed": "A",
            "spatialRasterLayers": "A",
            "spatialCellsLayer": "A"
          },
          "x": 0,
          "y": 0,
          "w": 6,
          "h": 6
        },
        {
          "component": "layerController",
          "coordinationScopes": {
            "dataset": "mouse",
            "spatialZoom": "A",
            "spatialRotation": "A",
            "spatialTargetX": "A",
            "spatialTargetY": "A",
            "spatialTargetZ": "A",
            "spatialRotationX": "A",
            "spatialRotationY": "A",
            "spatialRotationZ": "A",
            "spatialRotationOrbit": "A",
            "spatialOrbitAxis": "A",
            "spatialAxisFixed": "A",
            "spatialRasterLayers": "A",
            "spatialCellsLayer": "A"
          },
          "x": 6,
          "y": 0,
          "w": 2,
          "h": 6
        },
        {
          "component": "heatmap",
          "coordinationScopes": {
            "dataset": "mouse"
          },
          "props": {
            "transpose": true,
            "variablesLabelOverride": "feature"
          },
          "x": 0,
          "y": 6,
          "w": 6,
          "h": 6
        },
        {
          "component": "cellSets",
          "coordinationScopes": {
            "dataset": "mouse"
          },
          "x": 10,
          "y": 0,
          "w": 2,
          "h": 6
        },
        {
          "component": "genes",
          "coordinationScopes": {
            "dataset": "mouse"
          },
          "props": {
            "variablesLabelOverride": "feature"
          },
          "x": 8,
          "y": 0,
          "w": 2,
          "h": 6
        },
        {
          "component": "scatterplot",
          "coordinationScopes": {
            "dataset": "mouse",
            "embeddingType": "A"
          },
          "x": 6,
          "y": 6,
          "w": 3,
          "h": 6
        },
        {
          "component": "scatterplot",
          "coordinationScopes": {
            "dataset": "mouse",
            "embeddingType": "B"
          },
          "x": 9,
          "y": 6,
          "w": 3,
          "h": 6
        }
      ],
      "initStrategy": "auto"
    }
  ]
---

# Description

Fusion of metabolites, lipids and proteins at the single-cell level in the mammalian liver.

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

