import React from 'react';

import DeveloperBoardRounded from '@mui/icons-material/DeveloperBoardRounded';
import PreviewRounded from '@mui/icons-material/PreviewRounded';
import Button from '@mui/material/Button';

import { type DrawerSection } from 'js/shared-styles/Drawer';
import {
  AsctBIcon,
  EUIIcon,
  InfoIcon,
  OrganIcon,
  SearchIcon,
  SupportIcon,
  DonorIcon as UserIcon,
} from 'js/shared-styles/icons';
import ExternalImageIcon from 'js/shared-styles/icons/ExternalImageIcon';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { contactUsUrl } from 'js/shared-styles/Links/ContactUsLink';
import { DrawerTitle } from 'js/shared-styles/Drawer/styles';
import AuthButton from '../AuthButton';

export const resourceLinks: DrawerSection[] = [
  {
    title: 'User Guides',
    items: [
      {
        label: 'Tutorials',
        description: 'Learn more about how to explore the data portal',
        icon: <InfoIcon color="primary" />,
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
        icon: <ExternalImageIcon icon="hubmapConsortium" />,
        href: 'https://docs.hubmapconsortium.org/faq',
      },
      {
        label: 'About HuBMAP',
        description: 'Learn more about the HuBMAP Consortium',
        icon: <ExternalImageIcon icon="hubmapConsortium" />,
        href: 'https://docs.hubmapconsortium.org/about',
      },
    ],
  },
  {
    title: 'Developer Resources',
    items: [
      {
        label: 'Technical Documentation',
        description: 'Learn more about how to explore the data portal',
        icon: <DeveloperBoardRounded color="primary" />,
        href: 'https://docs.hubmapconsortium.org/faq',
      },
    ],
  },
  {
    title: 'Previews',
    items: [
      {
        label: '3D Tissue Maps',
        description: 'View a 3D tissue map of a LSFM dataset of a kidney',
        icon: <PreviewRounded color="primary" />,
        href: '/preview/3d-tissue-maps',
      },
      {
        label: 'Multimodal Molecular Imaging Data',
        description: 'Visualize multimodal molecular imaging data of IMS and MxIF of the kidney',
        icon: <PreviewRounded color="primary" />,
        href: '/preview/multimodal-molecular-imaging-data',
      },
      {
        label: 'Multimodal Mass Spectrometry Imaging Data',
        description: 'Visualize a 2D/3D preview of multimodal mass spectrometry imaging data of the liver',
        icon: <PreviewRounded color="primary" />,
        href: '/preview/multimodal-mass-spectrometry-imaging-data',
      },
      {
        label: 'Cell Type Annotations',
        description: 'Preview sample cell annotations from Cell Ontology of scRNA-seq datasets ',
        icon: <PreviewRounded color="primary" />,
        href: '/preview/cell-type-annotations',
      },
    ],
  },
];

export const dataLinks: DrawerSection[] = [
  {
    title: 'Datasets',
    items: [
      {
        label: 'Datasets',
        description: 'Find datasets by dataset type, organs, pipelines and other metadata',
        href: '/search?entity_type[0]=Dataset',
        icon: <entityIconMap.Dataset color="primary" />,
      },
      {
        label: 'Biomarker & Cell Type Search (Beta)',
        description: 'Find datasets by biomarker abundance or cell types',
        href: '/cells',
        icon: <SearchIcon color="primary" />,
      },
    ],
  },
  {
    title: 'Biological Knowledge References',
    items: [
      {
        label: 'Organs',
        description:
          'Explore an organ through spatial visualizations, reference-based analysis and other relevant data',
        href: '/organ',
        icon: <OrganIcon color="primary" />,
      },
      {
        label: 'Biomarkers (Beta)',
        description: 'Explore biomarkers and find detailed information on associated organs, cell types, and datasets',
        href: '/biomarkers',
        icon: <entityIconMap.Gene color="primary" />,
      },
      // {
      //   label: 'Cell Types',
      //   description:
      //     'Explore cell types and discover information on associated organs, defining biomarkers and datasets with annotated cell types',
      //   href: '/cell-types',
      //   icon: <entityIconMap.CellType color="primary" />,
      // },
    ],
  },
  {
    title: 'Curated Dataset Compilations',
    items: [
      {
        label: 'Collections',
        description: 'Navigate through collections of related datasets',
        href: '/collections',
        icon: <entityIconMap.Collection color="primary" />,
      },
      {
        label: 'Publications',
        description: 'View preprints and publications that generated or used HuBMAP data',
        href: '/publications',
        icon: <entityIconMap.Publication color="primary" />,
      },
    ],
  },
  {
    title: 'Supplemental Queries by Source',
    items: [
      {
        label: 'Samples',
        description: 'Find samples by organ and other metadata, and discover derived datasets',
        href: '/search?entity_type[0]=Sample',
        icon: <entityIconMap.Sample color="primary" />,
      },
      {
        label: 'Donors',
        description: 'Find donors by age, race and other metadata, and discover derived samples and datasets',
        href: '/search?entity_type[0]=Donor',
        icon: <entityIconMap.Donor color="primary" />,
      },
    ],
  },
  {
    title: "Can't find what you're looking for?",
    titleProps: { sx: { color: 'common.link' } },
    items: [
      <Button key="contact-support" startIcon={<SupportIcon />} href={contactUsUrl} variant="outlined" fullWidth>
        Contact Support
      </Button>,
    ],
  },
];

export const toolsAndAppsLinks: DrawerSection[] = [
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

export const userLinks: (isAuthenticated: boolean) => DrawerSection[] = (isAuthenticated) => {
  return [
    {
      title: 'Your Profile',
      hideTitle: true,
      items: [
        {
          href: '/profile',
          label: 'Profile',
          description: 'Find information about your profile',
          icon: <UserIcon color="primary" />,
        },
        {
          href: '/my-lists',
          label: 'My Lists',
          description: 'Find your bookmarks and lists',
          icon: <entityIconMap.Collection color="primary" />,
        },
        {
          href: '/my-workspaces',
          label: 'My Workspaces',
          description: 'Find your workspaces',
          icon: <entityIconMap.Workspace color="primary" />,
        },
      ],
    },
    <AuthButton key="auth-button" isAuthenticated={isAuthenticated} />,
  ];
};

export const mobileMenuLinks = dataLinks.concat(<DrawerTitle>Resources</DrawerTitle>, toolsAndAppsLinks);
