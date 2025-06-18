import React from 'react';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import {
  SearchIcon,
  DonorIcon,
  DownloadIcon,
  ListsIcon,
  OrganIcon,
  DatasetIcon,
  WorkspacesIcon,
} from 'js/shared-styles/icons';
import { TimelineData } from 'js/shared-styles/Timeline/types';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import ExternalImageIcon from 'js/shared-styles/icons/ExternalImageIcon';
import { buildSearchLink, createDatasetSearchLink } from 'js/components/search/store';
import { InternalLink } from 'js/shared-styles/Links';

const timelineIconProps = {
  fontSize: '1.5rem',
  height: '1.5rem',
  width: '1.5rem',
} as const;

const DATASETS: Record<string, string[]> = {
  'SNARE-seq2': ['SNARE-seq2', 'SNARE-seq2 [Salmon + ArchR + Muon]'],
  'Cell DIVE': ['Cell DIVE', 'Cell DIVE [DeepCell + SPRM]'],
  RNAseq: ['Bulk RNAseq', 'Bulk RNAseq [Salmon]'],
  PhenoCycler: ['PhenoCycler'],
};

const SNARE_SEQ2_LINK = createDatasetSearchLink({ 'SNARE-seq2': DATASETS['SNARE-seq2'] });
const CELL_DIVE_LINK = createDatasetSearchLink({ 'Cell DIVE': DATASETS['Cell DIVE'] });
const BULK_RNA_SEQ_LINK = createDatasetSearchLink({ RNAseq: DATASETS.RNAseq });
const PHENOCYCLER_LINK = createDatasetSearchLink({ PhenoCycler: DATASETS.PhenoCycler });

const COMBINED_DATASET_LINK = createDatasetSearchLink({
  'Cell DIVE': DATASETS['Cell DIVE'],
  RNAseq: DATASETS.RNAseq,
  PhenoCycler: DATASETS.PhenoCycler,
});

export const HOME_TIMELINE_ITEMS: TimelineData[] = [
  {
    title: 'Workspaces Now Support Multiple Running Sessions and Updated Python Environments',
    titleHref: '/workspaces',
    description:
      'Support for multiple simultaneous workspace sessions is now available. The Python environment and templates have also been updated for improved performance and compatibility.',
    date: 'June 2025',
    img: <WorkspacesIcon {...timelineIconProps} />,
  },
  {
    title: 'Organ Pages Now Show Identified Cell Types',
    titleHref: '/organ/kidney',
    description: (
      <>
        View cell types identified in HuBMAP datasets for an organ, now available for{' '}
        <InternalLink href="/organ/kidney">kidney</InternalLink> and{' '}
        <InternalLink href="/organ/lung">lung</InternalLink> organs.{' '}
      </>
    ),
    date: 'June 2025',
    img: <OrganIcon {...timelineIconProps} />,
  },
  {
    title: 'Improved Molecular & Cellular Data Query (Beta)',
    titleHref: '/cells',
    description: (
      <>
        Explore the improved <InternalLink href="/cells">Molecular & Cellular Data Query (Beta)</InternalLink> with a
        new scFind-powered search method, gene pathway-based queries, and enhanced visualizations for gene and cell type
        results.
      </>
    ),
    date: 'May 2025',
    img: <entityIconMap.CellType {...timelineIconProps} />,
  },

  {
    title: 'Asynchronous Workspace Sharing Now Available',
    titleHref: '/workspaces',
    description: (
      <>
        <InternalLink href="/workspaces">Workspace</InternalLink> copies can now be shared with collaborators, enabling
        more flexible team workflows and supporting independent contributions.
      </>
    ),
    date: 'April 2025',
    img: <WorkspacesIcon {...timelineIconProps} />,
  },
  {
    title: 'Global Data Products Now Available on Organ Pages',
    titleHref: '/organ',
    description:
      'Download HuBMAP-wide data products for an organ of interest that contain consolidated data for datasets of a particular assay type and tissue, aggregated across multiple datasets. Both raw and processed data products may be available.',
    date: 'March 2025',
    img: <OrganIcon {...timelineIconProps} />,
  },
  {
    title: 'New Cell DIVE, Bulk RNAseq, and PhenoCycler Datasets Available',
    titleHref: COMBINED_DATASET_LINK,
    description: (
      <>
        Explore and download new <InternalLink href={CELL_DIVE_LINK}>Cell DIVE</InternalLink>,{' '}
        <InternalLink href={BULK_RNA_SEQ_LINK}>Bulk RNAseq</InternalLink>, and{' '}
        <InternalLink href={PHENOCYCLER_LINK}>PhenoCycler</InternalLink> datasets.
      </>
    ),
    date: 'March 2025',
    img: <DatasetIcon {...timelineIconProps} />,
  },
  {
    title: 'My Lists Now Saved in Your User Profile',
    titleHref: '/my-lists',
    description: (
      <>
        <InternalLink href="/my-lists">My Lists</InternalLink> are now saved in your user profile.{' '}
        <InternalLink href="/login">Log in</InternalLink> to save new items and transfer any previously saved lists from
        local storage to your profile.
      </>
    ),
    date: 'February 2025',
    img: <ListsIcon {...timelineIconProps} />,
  },
  {
    title: 'New Cell Population Plot Visualization Tool',
    titleHref: '/organ/kidney',
    description: (
      <>
        Visualize cell populations of the datasets in an organ using the new interactive cell population plot
        visualization tool, now available on <InternalLink href="/organ/kidney">kidney</InternalLink> and{' '}
        <InternalLink href="/organ/heart">heart</InternalLink> pages.
      </>
    ),
    date: 'February 2025',
    img: <entityIconMap.CellType {...timelineIconProps} />,
  },
  {
    title: 'New SNARE-seq2 Datasets Available',
    titleHref: SNARE_SEQ2_LINK,
    description: (
      <>
        Explore and download <InternalLink href={SNARE_SEQ2_LINK}>SNARE-seq2</InternalLink> datasets.
      </>
    ),
    date: 'February 2025',
    img: <entityIconMap.Dataset {...timelineIconProps} />,
  },
  {
    title: 'Bulk Download Files Through HuBMAP CLT',
    titleHref: '/search/datasets',
    description: (
      <>
        Bulk downloading files from multiple datasets is now available on dataset search pages and individual dataset
        pages. The download produces a manifest file that can be used with the{' '}
        <OutboundIconLink href="https://docs.hubmapconsortium.org/clt/index.html">
          HuBMAP Command Line Transfer (CLT)
        </OutboundIconLink>{' '}
        tool.
      </>
    ),
    date: 'December 2024',
    img: <DownloadIcon {...timelineIconProps} />,
  },
  {
    title: 'New Workspaces templates and examples',
    titleHref: '/templates',
    description: (
      <>
        New workspace templates are available:
        <InternalLink href="/templates/scalable_cell_populations">
          “Scalable Cell Population Explorer”
        </InternalLink> and{' '}
        <InternalLink href="/templates/scfind">“Index and search single cell data with scfind”</InternalLink>. Explore a
        sample workspace for either template.
      </>
    ),
    date: 'September 2024',
    img: <entityIconMap.Workspace {...timelineIconProps} />,
  },
  {
    title: 'Raw & Processed Unified Datasets Page',
    titleHref: '/browse/dataset/8690897fced9931da34d66d669c1d698',
    description:
      'Dataset page design has been updated to display both raw and processed data on the same page, enhancing the understanding of relationships between datasets.',
    date: 'August 2024',
    img: <entityIconMap.Dataset {...timelineIconProps} />,
  },
  {
    title: '10X Multiome and Visium Datasets Now Available',
    titleHref: buildSearchLink({
      entity_type: 'Dataset',
      filters: {
        raw_dataset_type: {
          type: 'HIERARCHICAL',
          values: {
            '10X Multiome': ['10x Multiome', '10X Multiome', '10x Multiome [Salmon + ArchR + Muon]'],
            'Visium (no probes)': ['Visium (no probes)', 'Visium (no probes) [Salmon + Scanpy]'],
          },
        },
      },
    }),
    description: 'Explore and download 10X Multiome and Visium multi-assay datasets.',
    date: 'August 2024',
    img: <entityIconMap.Dataset {...timelineIconProps} />,
  },
  {
    title: 'Profile Page Now Available',
    titleHref: '/profile',
    description:
      'Profile pages are now available to allow logged in users to view their profile information including permission groups, saved lists and saved workspaces.',
    date: 'June 2024',
    img: <DonorIcon {...timelineIconProps} />,
  },
  {
    title: 'Homepage Redesign Updated',
    titleHref: '/',
    description: 'Homepage design updated to highlight portal features and improve navigation to essential locations.',
    date: 'June 2024',
    img: <ExternalImageIcon icon="dataPortal" style={timelineIconProps} />,
  },
  {
    title: 'Molecular & Cellular Query Updated',
    titleHref: '/cells',
    description: 'Search datasets by cell type name or Cell Ontology ID.',
    date: 'May 2024',
    img: <entityIconMap.CellType {...timelineIconProps} />,
  },
  {
    title: 'MUSIC Datasets now available',
    titleHref: buildSearchLink({
      entity_type: 'Dataset',
      filters: {
        raw_dataset_type: {
          type: 'HIERARCHICAL',
          values: {
            MUSIC: ['MUSIC'],
          },
        },
      },
    }),
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
    titleHref: buildSearchLink({
      entity_type: 'Dataset',
      filters: {
        processing: {
          type: 'TERM',
          values: ['processed', 'raw'],
        },
        pipeline: {
          type: 'TERM',
          values: ['Salmon', 'Cytokit + SPRM', 'SnapATAC'],
        },
        visualization: {
          type: 'TERM',
          values: ['true'],
        },
      },
    }),
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
