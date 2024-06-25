import React from 'react';

import NavigationDrawer, { useDrawerState, type DrawerSection } from 'js/shared-styles/Drawer';
import AppsRounded from '@mui/icons-material/AppsRounded';
import { AsctBIcon, EUIIcon } from 'js/shared-styles/icons';
import ExternalImageIcon from 'js/shared-styles/icons/ExternalImageIcon';
import HeaderButton from '../HeaderButton/HeaderButton';

const links: DrawerSection[] = [
  {
    title: 'Data',
    items: [
      {
        label: 'HuBMAP Data Portal',
        description:
          'Explore, visualize and download consortium-generated spatial and single cell data for the human body',
        href: '/',
        icon: <ExternalImageIcon icon="dataPortal" />,
      },
    ],
  },
  {
    title: 'Atlas',
    items: [
      {
        label: 'Human Reference Atlas',
        description:
          'Navigate a comprehensive, high-resolution, three-dimensional atlas of all the cells in the healthy human body',
        href: 'https://humanatlas.io/',
        icon: <ExternalImageIcon icon="hra" />,
      },
      {
        label: 'Exploration User Interface (EUI)',
        description: 'Explore and validate spatially registered tissue blocks and cell-type populations',
        href: '/ccf-eui',
        icon: <EUIIcon />,
      },
      {
        label: 'ASCT+B Reporter',
        description: 'Explore and compare ASCT+B tables and construct OMAP tables',
        href: 'https://hubmapconsortium.github.io/ccf-asct-reporter/',
        icon: <AsctBIcon />,
      },
    ],
  },
  {
    title: 'Analytical Tools',
    items: [
      {
        label: 'Azimuth',
        description:
          'View annotated, reference datasets to automate the processing, analysis, and interpretation of a new single-cell RNA-seq or ATAC-seq experiment',
        href: 'https://azimuth.hubmapconsortium.org/',
        icon: <ExternalImageIcon icon="azimuth" />,
      },
      {
        label: 'FUSION',
        description:
          'Interact with spatial transcriptomics data integrated with histopathology, driven by artificial intelligence',
        href: 'http://fusion.hubmapconsortium.org/?utm_source=hubmap',
        icon: <ExternalImageIcon icon="fusion" />,
      },
      {
        label: 'Antibody Validation Reports',
        description:
          'Provide antibody details for multiplex imaging assays and capture data requested by journals for manuscript submission',
        href: 'https://avr.hubmapconsortium.org/',
        icon: <ExternalImageIcon icon="avr" />,
      },
    ],
  },
];

export default function ToolsAndApplicationLinks() {
  const { open, toggle, onClose } = useDrawerState();
  const title = 'Tools and Applications';
  return (
    <>
      <HeaderButton tooltip={title} title={title} altOnlyTitle onClick={toggle} icon={<AppsRounded />} />
      <NavigationDrawer title={title} direction="right" sections={links} onClose={onClose} open={open} />
    </>
  );
}
