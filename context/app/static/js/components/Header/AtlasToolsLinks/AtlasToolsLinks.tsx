import React from 'react';

import LinkGroups, { LinksSectionProps } from '../LinkGroups';

const groups = {
  ccf: [
    {
      href: 'https://humanatlas.io',
      label: 'Human Reference Atlas (HRA) Portal',
    },
    {
      href: 'https://hubmapconsortium.github.io/ccf-asct-reporter/',
      label: 'ASCT+B Reporter',
    },
    {
      href: 'https://portal.hubmapconsortium.org/ccf-eui',
      label: 'Exploration User Interface (EUI)',
    },
    {
      href: 'https://hubmapconsortium.github.io/ccf-ui/rui/',
      label: 'Registration User Interface (RUI)',
    },
  ],
  azimuth: [
    {
      href: 'https://azimuth.hubmapconsortium.org/',
      label: 'Azimuth: Reference-based single cell mapping',
    },
  ],
  hra: [
    {
      href: 'https://hubmapconsortium.github.io/hra-previews/pilots/pilot1.html',
      label: 'HRA Preview: ASCT+B Reporter Comparison',
    },
    {
      href: 'https://hubmapconsortium.github.io/hra-previews/pilots/pilot2.html',
      label: 'HRA Preview: Vasculature CCF Visualization',
    },
    {
      href: 'https://hubmapconsortium.github.io/hra-previews/pilots/pilot3.html',
      label: 'HRA Preview: HRA vs. Experimental Data',
    },
    {
      href: 'https://hubmapconsortium.github.io/hra-previews/pilots/pilot4.html',
      label: 'HRA Preview: Scrollytelling Series',
    },
    {
      href: 'https://hubmapconsortium.github.io/hra-previews/pilots/pilot5.html',
      label: 'HRA Preview: Tabula Sapiens Comparisons',
    },
    {
      href: 'https://hubmapconsortium.github.io/hra-previews/pilots/pilot6.html',
      label: 'HRA Preview: FTU Segmentation',
    },
    {
      href: 'https://hubmapconsortium.github.io/hra-previews/pilots/pilot7.html',
      label: 'HRA Preview: Mesh-Level Collision Detection',
    },
  ],
  avr: [
    {
      href: 'https://avr.hubmapconsortium.org',
      label: 'Antibody Validation Reports',
    },
  ],
};

function AtlasToolsLinks({ isIndented }: LinksSectionProps) {
  return <LinkGroups groups={groups} isIndented={isIndented} />;
}

export default AtlasToolsLinks;
