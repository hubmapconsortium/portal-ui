---
title: Liver Map
group_name: TODO
created_by_user_displayname: TODO
created_by_user_email: TODO
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
                    "url": "http://localhost:8000/human_3d.raster.pyramid.ome.tiff",
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
          "component": "description",
          "coordinationScopes": {
            "dataset": "human"
          },
          "x": 8,
          "y": 9,
          "w": 4,
          "h": 3
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
          "h": 9
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
                    "url": "http://localhost:8000/mouse_2d.raster.pyramid.ome.tiff",
                    "metadata": {
                      "isBitmask": false
                    }
                  },
                  {
                    "name": "Cell Segmentations",
                    "type": "ome-tiff",
                    "url": "http://localhost:8000/mouse_2d.cell_ids.ome.tiff",
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
        }
      },
      "layout": [
        {
          "component": "spatial",
          "coordinationScopes": {
            "dataset": "mouse"
          },
          "x": 0,
          "y": 0,
          "w": 8,
          "h": 12
        },
        {
          "component": "description",
          "coordinationScopes": {
            "dataset": "mouse"
          },
          "x": 8,
          "y": 9,
          "w": 4,
          "h": 3
        },
        {
          "component": "layerController",
          "coordinationScopes": {
            "dataset": "mouse"
          },
          "x": 8,
          "y": 0,
          "w": 4,
          "h": 9
        }
      ],
      "initStrategy": "auto"
    }
  ]
---

# Description

Fusion of metabolites, lipids and proteins at the single-cell level.

## Experimental Details

TODO

## Protocols

**Overall**: [dx.doi.org/10.17504/TODO](https://dx.doi.org/10.17504/TODO)

## Contributors

- **TODO**: TODO – <TODO@TODO.edu>
