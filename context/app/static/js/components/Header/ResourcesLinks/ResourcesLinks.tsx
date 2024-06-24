import React from 'react';

import NavigationDrawer, { useDrawerState, type DrawerSection } from 'js/shared-styles/Drawer';
import { InfoIcon } from 'js/shared-styles/icons';
import { DeveloperBoardRounded, PreviewRounded } from '@mui/icons-material';
import HeaderButton from '../HeaderButton/HeaderButton';

const links: DrawerSection[] = [
  {
    title: 'User Guides',
    items: [
      {
        label: 'Tutorials',
        description: 'Learn more about how to explore the data portal',
        icon: <InfoIcon />,
        href: '/tutorials',
      },
    ],
  },
  {
    title: 'Consortium Resources',
    items: [
      {
        label: 'Consortium FAQ',
        description: 'Explore frequently asked question about the HuBMAP Consortium',
        icon: <InfoIcon />,
        href: '/consortium-faq', // TODO: Get the correct URL
      },
      {
        label: 'About HuBMAP',
        description: 'Learn more about the HuBMAP Consortium',
        icon: <InfoIcon />,
        href: '/consortium-faq', // TODO: Get the correct URL and icon
      },
    ],
  },
  {
    title: 'Developer Resources',
    items: [
      {
        label: 'Technical Documentation',
        description: 'Learn more about how to explore the data portal',
        icon: <DeveloperBoardRounded />,
        href: '/tutorials',
      },
    ],
  },
  {
    title: 'Previews',
    items: [
      {
        label: '3D Tissue Maps',
        description: 'View a 3D tissue map of a LSFM dataset of a kidney',
        icon: <PreviewRounded />,
        href: '/tutorials',
      },
      {
        label: 'Multimodal Molecular Imaging Data',
        description: 'Visualize multimodal molecular imaging data of IMS and MxIF of the kidney',
        icon: <PreviewRounded />,
        href: '/tutorials',
      },
      {
        label: 'Multimodal Mass Spectrometry Imaging Data',
        description: 'Visualize a 2D/3D preview of multimodal mass spectrometry imaging data of the liver',
        icon: <PreviewRounded />,
        href: '/tutorials',
      },
      {
        label: 'Cell Type Annotations',
        description: 'Preview sample cell annotations from Cell Ontology of scRNA-seq datasets ',
        icon: <PreviewRounded />,
        href: '/tutorials',
      },
    ],
  },
];

export default function ResourcesLinks() {
  const { open, toggle, onClose } = useDrawerState();
  const title = 'Resources';
  return (
    <>
      <HeaderButton title={title} onClick={toggle} icon={<InfoIcon />} />
      <NavigationDrawer title={title} direction="left" sections={links} onClose={onClose} open={open} />
    </>
  );
}
