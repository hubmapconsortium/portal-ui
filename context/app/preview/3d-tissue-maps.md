---
title: 3D Visualization of the Adult Human Kidney Using Light Sheet Fluorescence Microscopy
group_name: Washington University in St. Louis
created_by_user_displayname: Sanjay Jain
created_by_user_email: sanjayjain@wustl.edu
vitessce_conf:
  {
    'version': '1.0.16',
    'name': 'Jain Kidney Decimated 2024',
    'datasets':
      [
        {
          'uid': 'A',
          'name': '3D Kidney',
          'files':
            [
              {
                'url': 'https://data-2.vitessce.io/data/washu-kidney/LS_20x_5_Stitched.pyramid.ome.tiff',
                'fileType': 'image.ome-tiff',
                'coordinationValues': { 'fileUid': 'kidney', 'obsType': 'gloms' },
                'options':
                  {
                    'offsetsUrl': 'https://data-2.vitessce.io/data/washu-kidney/LS_20x_5_Stitched.pyramid.offsets.json',
                  },
              },
              {
                'url': 'https://data-2.vitessce.io/data/washu-kidney/decimated.glb',
                'fileType': 'obsSegmentations.glb',
                'coordinationValues': { 'fileUid': 'gloms', 'obsType': 'gloms' },
                'options':
                  {
                    'targetX': 430,
                    'targetY': -520,
                    'targetZ': -420,
                    'scaleX': -0.275,
                    'scaleY': 0.034375,
                    'scaleZ': 0.275,
                    'rotationX': 1.57079632679,
                    'sceneScaleX': 1,
                    'sceneScaleY': 1,
                    'sceneScaleZ': 8,
                    'materialSide': 'back',
                  },
              },
              {
                'url': 'https://data-2.vitessce.io/data/washu-kidney/statistics.csv',
                'fileType': 'obsFeatureMatrix.csv',
                'coordinationValues': { 'obsType': 'gloms', 'featureType': 'feature', 'featureValueType': 'value' },
              },
            ],
        },
      ],
    'coordinationSpace':
      {
        'dataset': { 'A': 'A' },
        'obsSetSelection': { 'A': null },
        'obsSetColor': { 'A': null },
        'obsHighlight': { 'A': null },
        'obsColorEncoding': { 'A': 'spatialChannelColor' },
        'obsType': { 'A': 'gloms' },
        'featureType': { 'A': 'feature' },
        'featureValueType': { 'A': 'value' },
        'featureSelection': { 'A': ['Volume'] },
        'spatialTargetZ': { 'A': 0 },
        'spatialTargetT': { 'A': 0 },
        'imageLayer': { 'A': '__dummy__' },
        'fileUid': { 'A': 'kidney', 'B': 'gloms' },
        'spatialLayerOpacity': { 'A': 1, 'B': 1 },
        'photometricInterpretation': { 'A': 'BlackIsZero' },
        'spatialTargetResolution': { 'A': null },
        'imageChannel': { 'A': '__dummy__', 'B': '__dummy__' },
        'spatialTargetC': { 'A': 0, 'B': 1, 'C': 0 },
        'spatialChannelColor': { 'A': [221, 52, 151], 'B': [29, 145, 192], 'C': [253, 174, 107] },
        'spatialChannelVisible': { 'A': true, 'B': true, 'C': true },
        'spatialChannelOpacity': { 'A': 1, 'B': 1, 'C': 0.5 },
        'spatialChannelWindow': { 'A': [773, 7733], 'B': [2290, 6724] },
        'segmentationLayer': { 'A': '__dummy__' },
        'spatialLayerVisible': { 'A': true },
        'segmentationChannel': { 'A': '__dummy__' },
        'spatialSegmentationFilled': { 'A': false },
        'spatialSegmentationStrokeWidth': { 'A': 0.01 },
        'metaCoordinationScopes':
          { 'A': { 'spatialTargetZ': 'A', 'spatialTargetT': 'A', 'imageLayer': ['A'], 'segmentationLayer': ['A'] } },
        'metaCoordinationScopesBy':
          {
            'A':
              {
                'imageLayer':
                  {
                    'fileUid': { 'A': 'A' },
                    'spatialLayerOpacity': { 'A': 'A' },
                    'photometricInterpretation': { 'A': 'A' },
                    'spatialTargetResolution': { 'A': 'A' },
                    'imageChannel': { 'A': ['A', 'B'] },
                  },
                'imageChannel':
                  {
                    'spatialTargetC': { 'A': 'A', 'B': 'B' },
                    'spatialChannelColor': { 'A': 'A', 'B': 'B' },
                    'spatialChannelVisible': { 'A': 'A', 'B': 'B' },
                    'spatialChannelOpacity': { 'A': 'A', 'B': 'B' },
                    'spatialChannelWindow': { 'A': 'A', 'B': 'B' },
                  },
                'segmentationLayer':
                  {
                    'fileUid': { 'A': 'B' },
                    'spatialLayerVisible': { 'A': 'A' },
                    'spatialLayerOpacity': { 'A': 'B' },
                    'segmentationChannel': { 'A': ['A'] },
                  },
                'segmentationChannel':
                  {
                    'obsType': { 'A': 'A' },
                    'featureType': { 'A': 'A' },
                    'featureValueType': { 'A': 'A' },
                    'featureSelection': { 'A': 'A' },
                    'spatialTargetC': { 'A': 'C' },
                    'spatialChannelColor': { 'A': 'C' },
                    'spatialChannelOpacity': { 'A': 'C' },
                    'spatialChannelVisible': { 'A': 'C' },
                    'obsColorEncoding': { 'A': 'A' },
                    'spatialSegmentationFilled': { 'A': 'A' },
                    'spatialSegmentationStrokeWidth': { 'A': 'A' },
                    'obsHighlight': { 'A': 'A' },
                    'obsSetSelection': { 'A': 'A' },
                    'obsSetColor': { 'A': 'A' },
                  },
              },
          },
      },
    'layout':
      [
        {
          'component': 'spatialBeta',
          'coordinationScopes': { 'dataset': 'A', 'metaCoordinationScopes': ['A'], 'metaCoordinationScopesBy': ['A'] },
          'x': 0,
          'y': 0,
          'w': 6,
          'h': 12,
          'props': { 'three': true },
        },
        {
          'component': 'layerControllerBeta',
          'coordinationScopes': { 'dataset': 'A', 'metaCoordinationScopes': ['A'], 'metaCoordinationScopesBy': ['A'] },
          'x': 6,
          'y': 0,
          'w': 6,
          'h': 6,
        },
        {
          'component': 'obsSets',
          'coordinationScopes': { 'dataset': 'A', 'obsSetSelection': 'A', 'obsSetColor': 'A' },
          'x': 6,
          'y': 6,
          'w': 6,
          'h': 3,
        },
        {
          'component': 'featureBarPlot',
          'coordinationScopes':
            {
              'dataset': 'A',
              'obsType': 'A',
              'featureType': 'A',
              'featureValueType': 'A',
              'featureSelection': 'A',
              'obsHighlight': 'A',
              'obsSetSelection': 'A',
              'obsSetColor': 'A',
              'obsColorEncoding': 'A',
            },
          'coordinationScopesBy': {},
          'x': 6,
          'y': 9,
          'w': 6,
          'h': 3,
          'props': { 'yUnits': 'microns cubed' },
        },
      ],
    'initStrategy': 'auto',
  }
---

# Description

We developed and applied a method to perform light sheet fluorescence microscopy (LSFM) on the adult human kidney to understand its neurovascular organization in relation to kidney functional tissue units. The data shown is a kidney slice of up to a few millimeters in depth and spans the entire cortex and the medulla. Clearing of the tissue was performed using active clarity with shield kit reagent and imaging was done on a Zeiss 7 LSFM microscope. Markers for specific structures include AQP2 for the collecting system, NPHS1 for glomeruli, TUBB3 (TUJ1) for nerves, CD31 (PECAM) for blood vessels, and DAPI for nuclei. Image processing and analysis were mainly done using Imaris software. Images were acquired at 5X and several fields were selected for imaging at 20X.

<!--
## Experimental Details


## Protocols


**Overall**: [dx.doi.org/10.17504/TODO](https://dx.doi.org/10.17504/TODO)
-->

## Contributors

<!--
- ** **: Contributor_Display_Name – <email@domain.tld>

or

- Contributor_Display_Name
-->

- Liam McLaughlin
- Bo Zhang
- Amanda Knoten
- Sanjay Jain

Funding: U54DK134301
