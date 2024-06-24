import React from 'react';

import NavigationDrawer, { useDrawerState, type DrawerSection } from 'js/shared-styles/Drawer';
import { DatabaseIcon, SearchIcon } from 'js/shared-styles/icons';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { OrganIcon } from 'js/shared-styles/icons/URLSvgIcon';
import HeaderButton from '../HeaderButton/HeaderButton';

const links: DrawerSection[] = [
  {
    title: 'Datasets',
    items: [
      {
        label: 'Datasets',
        description: 'Find datasets by dataset type, organs, pipelines and other metadata',
        href: '/search?entity_type[0]=Dataset',
        icon: <entityIconMap.Dataset />,
      },
      {
        label: 'Biomarker & Cell Type Search (Beta)',
        description: 'Find datasets by biomarker abundance or cell types',
        href: '/cells',
        icon: <SearchIcon />,
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
        icon: <OrganIcon ariaLabel="Organ Icon" />,
      },
      {
        label: 'Biomarkers (Beta)',
        description: 'Explore biomarkers and find detailed information on associated organs, cell types, and datasets',
        href: '/biomarkers',
        icon: <entityIconMap.Gene />,
      },
      {
        label: 'Cell Types',
        description:
          'Explore cell types and discover information on associated organs, defining biomarkers and datasets with annotated cell types',
        href: '/cell-types',
        icon: <entityIconMap.CellType />,
      },
    ],
  },
  {
    title: 'Curated Dataset Compilations',
    items: [
      {
        label: 'Collections',
        description: 'Navigate through collections of related datasets',
        href: '/collections',
        icon: <entityIconMap.Collection />,
      },
      {
        label: 'Publications',
        description: 'View preprints and publications that generated or used HuBMAP data',
        href: '/publications',
        icon: <entityIconMap.Publication />,
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
        icon: <entityIconMap.Sample />,
      },
      {
        label: 'Donors',
        description: 'Find donors by age, race and other metadata, and discover derived samples and datasets',
        href: '/search?entity_type[0]=Donor',
        icon: <entityIconMap.Donor />,
      },
    ],
  },
];

export default function DataLinks() {
  const { open, toggle, onClose } = useDrawerState();
  const title = 'Data';
  return (
    <>
      <HeaderButton title={title} onClick={toggle} icon={<DatabaseIcon />} />
      <NavigationDrawer title={title} direction="left" sections={links} onClose={onClose} open={open} />
    </>
  );
}
