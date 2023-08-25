import React from 'react';

import LinkGroups, { LinksSectionProps } from '../LinkGroups';

const groups = [
  [
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
  ],
];

function OtherLinks({ isIndented }: LinksSectionProps) {
  return <LinkGroups groups={groups} isIndented={isIndented} />;
}

export default OtherLinks;
