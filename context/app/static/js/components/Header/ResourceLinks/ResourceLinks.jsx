import React from 'react';

import LinkGroups, { LinksSectionProps } from '../LinkGroups';

const previewLinks = [
  'Multimodal Molecular Imaging Data',
  'Multimodal Mass Spectrometry Imaging Data',
  'Cell Type Annotations',
].map((previewName) => ({
  href: `/preview/${previewName.toLowerCase().replace(/\W+/g, '-')}`,
  label: `Preview: ${previewName}`,
}));

const groups = {
  docs: [
    { href: 'https://software.docs.hubmapconsortium.org/technical', label: 'Technical Documentation' },
    { href: 'https://software.docs.hubmapconsortium.org/faq', label: 'FAQ' },
    { href: 'https://software.docs.hubmapconsortium.org/about', label: 'About' },
  ],
  previews: previewLinks,
};

function ResourceLinks({ isIndented }: LinksSectionProps) {
  return <LinkGroups groups={groups} isIndented={isIndented} />;
}

export default React.memo(ResourceLinks);
