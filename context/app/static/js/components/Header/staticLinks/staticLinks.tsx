import React from 'react';

import LinkGroups, { LinkGroupType, LinksSectionProps } from '../LinkGroups';

function withLinkGroups(groups: LinkGroupType) {
  return function LinksSection({ isIndented }: LinksSectionProps) {
    return <LinkGroups groups={groups} isIndented={isIndented} />;
  };
}

const atlasGroups = {
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

const AtlasToolsLinks = withLinkGroups(atlasGroups);

const otherGroups = {
  other: [
    {
      href: '/collections',
      label: 'Data Collections',
    },
    {
      href: '/organ',
      label: 'Organs',
    },
    {
      href: '/publications',
      label: 'Publications',
    },
    {
      href: '/cells',
      label: 'Molecular Data Queries - BETA',
    },
    {
      href: '/biomarkers',
      label: 'Biomarkers - BETA',
    },
  ],
};

const OtherLinks = withLinkGroups(otherGroups);

const previewLinks = [
  'Multimodal Molecular Imaging Data',
  'Multimodal Mass Spectrometry Imaging Data',
  'Cell Type Annotations',
].map((previewName) => ({
  href: `/preview/${previewName.toLowerCase().replace(/\W+/g, '-')}`,
  label: `Preview: ${previewName}`,
}));

const resourceGroups = {
  docs: [
    { href: 'https://software.docs.hubmapconsortium.org/technical', label: 'Technical Documentation' },
    { href: 'https://software.docs.hubmapconsortium.org/faq', label: 'FAQ' },
    { href: 'https://software.docs.hubmapconsortium.org/about', label: 'About' },
  ],
  previews: previewLinks,
};

const ResourceLinks = withLinkGroups(resourceGroups);

export { AtlasToolsLinks, OtherLinks, ResourceLinks };
