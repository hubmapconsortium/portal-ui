---
title: Multimodal Molecular Imaging Data
group_name: Vanderbilt
created_by_user_displayname: Jeff Spraggins
created_by_user_email: jeff.spraggins@vanderbilt.edu
vitessce_conf:
  {
    'version': '0.1.0',
    'layers':
      [
        {
          'name': 'raster',
          'type': 'RASTER',
          'fileType': 'raster.json',
          'url': 'https://data-1.vitessce.io/0.0.31/master_release/spraggins/spraggins.raster.json',
        },
      ],
    'name': 'Spraggins',
    'public': true,
    'staticLayout':
      [
        {
          'component': 'spatial',
          'props': { 'view': { 'zoom': -6.5, 'target': [20000, 20000, 0] } },
          'x': 0,
          'y': 0,
          'w': 9,
          'h': 2,
        },
        { 'component': 'layerController', 'x': 9, 'y': 0, 'w': 3, 'h': 2 },
      ],
  }
---

# Description

These data are multimodal molecular images collected from the kidney of a 61-year-old, white female donor by the [BIOmolecular Multimodal Imaging Center](https://medschool.vanderbilt.edu/biomic/) (BIOMIC) at Vanderbilt University. BIOMIC is a Tissue Mapping Center that is part of the NIH funded [Human BioMolecular Atlas Program](https://doi.org/10.1038/s41586-019-1629-x) (HuBMAP). Datasets generated by BIOMIC combine MALDI imaging mass spectrometry with various microscopy modalities including multiplexed immunofluorescence, autofluorescence, and histological stained microscopy. MALDI imaging mass spectrometry enables the spatial mapping of hundreds-to-thousands of metabolites, lipids, peptides or proteins in biological tissues at cellular resolutions. By combining imaging mass spectrometry with multiplexed immunofluorescence imaging, molecular profiles of specific tissue functional units and cell types can be constructed. This work is supported by the NIH Common Fund and National Institute of Diabetes and Digestive and Kidney Diseases (U54 DK120058). Tissue was collected through the Cooperative Human Tissue Network with support provided by the NIH National Cancer Institute (5 UM1 CA183727-08).

## Experimental Details

Imaging mass spectrometry (IMS) and multiplexed immunofluorescence imaging (MxIF) were performed on serial tissue sections collected from surgical resection fresh frozen tissue blocks. Prior to IMS and MxIF, autofluorescence microscopy (10x objective, ~300 nm spatial resolution) was performed on both serial sections for later [multimodal image registration](https://pubs.acs.org/doi/10.1021/acs.analchem.8b02884). Positive ion mode imaging mass spectrometry was performed at 10µm spatial resolution using a [prototype MALDI timsTOF Flex](https://pubs.acs.org/doi/10.1021/acs.analchem.9b03612) (Bruker Daltonics) using 1,5-diaminonaphthalene as the matrix. The serial section was fixed in 10% formalin, blocked, and stained overnight in the first cycle of antibodies. Fluorescence microscopy (10x objective, ~300 nm spatial resolution) is then performed on a Zeiss Axio Scan.Z1. For multiplexed experiments, the fluorophores are inactivated using a combination of bleaching solution and light and the sequence is repeated.

## Protocols

**Overall**: [dx.doi.org/10.17504/protocols.io.bfskjncw](https://dx.doi.org/10.17504/protocols.io.bfskjncw)

## Contributors

- **IMS**: Elizabeth K. Neumann – <elizabeth.neumann@vanderbilt.edu>
- **MxIF**: Mark deCaestecker – <mark.de.caestecker@vumc.org>
- **Data Processing**: N. Heath Patterson – <nathan.h.patterson@vanderbilt.edu>
