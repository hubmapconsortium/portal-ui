import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { SearchIcon } from 'js/shared-styles/icons';
import { TimelineData } from 'js/shared-styles/Timeline/types';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import React from 'react';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

const timelineIconProps = {
  fontSize: '1.5rem',
} as const;

export const HOME_TIMELINE_ITEMS: TimelineData[] = [
  {
    title: 'Molecular & Cellular Query Updated',
    titleHref: '/cells',
    description: 'Search datasets by cell type name or Cell Ontology ID.',
    date: 'May 2024',
    img: <entityIconMap.CellType {...timelineIconProps} />,
  },
  {
    title: 'MUSIC Datasets now available',
    titleHref: '/search?raw_dataset_type_keyword-assay_display_name_keyword[MUSIC][0]=MUSIC&entity_type[0]=Dataset',
    description: (
      <>
        Download data from <OutboundIconLink href="https://github.com/gersteinlab/MUSIC">MUSIC</OutboundIconLink>{' '}
        analyses of ChIP-Seq experiments.
      </>
    ),
    date: 'May 2024',
    img: <entityIconMap.Dataset {...timelineIconProps} />,
  },
  {
    title: 'Dataset Search reorganized',
    titleHref:
      '/search?processing[0]=processed&processing[1]=raw&pipeline[0]=Salmon&pipeline[1]=Cytokit %2B SPRM&pipeline[2]=SnapATAC&visualization[0]=true&entity_type[0]=Dataset',
    description:
      'Added visualization, dataset category and pipeline filters to dataset search page. Dataset assay filter is now hierarchical to improve grouping of similar experiments.',
    date: 'March 2024',
    img: <SearchIcon {...timelineIconProps} />,
  },
  {
    title: 'Workspace Beta announced',
    titleHref: '/workspaces',
    description: (
      <>
        Beta group has been opened to a larger group of beta testers. You must be a registered workspace beta tester to
        use this feature. <ContactUsLink capitalize /> if interested.
      </>
    ),
    img: <entityIconMap.Workspace {...timelineIconProps} />,
    date: 'December 2023',
  },
  {
    title: 'Biomarkers Beta released',
    titleHref: '/biomarkers',
    description:
      'Beta of biomarkers page is now available to all public users. Gene information is currently available, and protein information is in development.',
    date: 'December 2023',
    img: <entityIconMap.Gene {...timelineIconProps} />,
  },
];

export type HeroSlideTitle = 'Discover' | 'Visualize' | 'Download';

export function isSlideTitle(s: string): s is HeroSlideTitle {
  return ['Discover', 'Visualize', 'Download'].includes(s);
}

interface HeroImage {
  imageBase: string;
  imageAlt: string;
}

const heroImageBaseDir = 'v2/hero/hero_';
export const HERO_IMAGE_SLIDES: Record<HeroSlideTitle, HeroImage> = {
  Discover: {
    imageBase: `${heroImageBaseDir}discover`,
    imageAlt: 'Overlaid screenshots of tools for browsing data',
  },
  Visualize: {
    imageBase: `${heroImageBaseDir}visualize`,
    imageAlt: 'Screenshot of a Vitessce visualization with spatial segmentation data and an embedding plot',
  },
  Download: {
    imageBase: `${heroImageBaseDir}download`,
    imageAlt: 'Screenshots of tools for downloading scientific data underlying HuBMAP datasets',
  },
};
