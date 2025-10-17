import { DatabaseIcon, VisualizationIcon, WorkspacesIcon, SearchIcon, FeaturedIcon } from 'js/shared-styles/icons';
import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';

export const TUTORIAL_CATEGORIES = ['Biomarker and Cell Type Search', 'Data', 'Visualization', 'Workspaces'] as const;

export type TutorialCategory = (typeof TUTORIAL_CATEGORIES)[number];

export interface TutorialCategoryData {
  title: TutorialCategory | 'Featured Tutorials';
  description: string;
  icon: MUIIcon;
  id: string;
}

export type TutorialCategorySection = TutorialCategory | 'Featured Tutorials';

export const TUTORIAL_CATEGORY_DATA: Record<TutorialCategorySection, TutorialCategoryData> = {
  'Featured Tutorials': {
    title: 'Featured Tutorials',
    description: 'Get started quickly with these essential HuBMAP tutorials.',
    icon: FeaturedIcon,
    id: 'featured-tutorials',
  },
  'Biomarker and Cell Type Search': {
    title: 'Biomarker and Cell Type Search',
    description: "Learn how to explore biomarkers and cell types using HuBMAP's Biomarker and Cell Type Search tool.",
    icon: SearchIcon,
    id: 'biomarker-cell-type-search',
  },
  Data: {
    title: 'Data',
    description: 'Discover how to find, interpret, and download HuBMAP data.',
    icon: DatabaseIcon,
    id: 'data',
  },
  Visualization: {
    title: 'Visualization',
    description: "Explore built-in visualization tools to interact with HuBMAP's spatial and single-cell data.",
    icon: VisualizationIcon,
    id: 'visualization',
  },
  Workspaces: {
    title: 'Workspaces',
    description: 'Learn how to launch and use workspaces to analyze datasets in a JupyterLab environment.',
    icon: WorkspacesIcon,
    id: 'workspaces',
  },
};

export interface Tutorial {
  title: string;
  route: string;
  description: string;
  tags: string[];
  category: TutorialCategory;
  iframeLink: string;
  isFeatured?: boolean;
}

export const TUTORIALS: Tutorial[] = [
  {
    title: 'Exploring Organs, Cell Types, and Biomarkers',
    route: 'exploring-organs-cell-types-biomarkers',
    description: 'Learn how to explore organs, cell types and biomarkers available in HuBMAP data.',
    category: 'Data',
    tags: ['Biomarker', 'Cell Type', 'Organ'],
    iframeLink: '',
  },
  {
    title: 'Getting Started with HuBMAP Data',
    route: 'getting-started',
    description:
      'Learn how to find HuBMAP datasets using the datasets search page, and explore key information, visualizations and file download options.',
    category: 'Data',
    isFeatured: true,
    tags: ['Data Download', 'Metadata'],
    iframeLink:
      'https://app.tango.us/app/embed/04529384-4ed4-49d4-9c52-0eca16c147fb?skipCover=false&defaultListView=true&skipBranding=false',
  },
  {
    title: 'How to Download HuBMAP Data',
    route: 'downloading-data',
    description:
      'Learn how to download HuBMAP data using different methods, including Globus and dbGaP for individual datasets, and the HuBMAP Command Line Transfer (CLT) tool for bulk downloads.',
    category: 'Data',
    tags: ['Data Download'],
    iframeLink: '',
  },
  {
    title: 'Navigating Workspaces',
    route: 'workspaces',
    description:
      'Learn how to use workspaces to analyze HuBMAP data by initiating Jupyter notebooks and choosing from a variety of pre-established templates.',
    tags: ['Data Analysis'],
    category: 'Workspaces',
    iframeLink:
      'https://app.tango.us/app/embed/bcece94f-ba05-4acb-b05b-a7d333afc583?skipCover=false&defaultListView=true&skipBranding=false',
  },
  {
    title: 'Search for Cell Types',
    route: 'search-for-cell-types',
    description:
      'Learn how to find datasets for selected cell types, and visualize distributions across organs and within an individual dataset.',
    category: 'Biomarker and Cell Type Search',
    tags: ['Cell Type'],
    iframeLink: '',
  },
  {
    title: 'Search for Gene or Pathway',
    route: 'search-for-gene-or-pathway',
    description:
      'Learn how to find datasets for genes or pathways, and visualize the gene expression for the individual datasets.',
    category: 'Biomarker and Cell Type Search',
    tags: ['Biomarker', 'Gene', 'Pathway'],
    iframeLink: '',
  },
  {
    title: 'Search for Proteins',
    route: 'search-for-proteins',
    description:
      'Learn how to find datasets for proteins, and visualize the protein abundance for the individual datasets.',
    category: 'Biomarker and Cell Type Search',
    tags: ['Protein', 'Biomarker'],
    iframeLink: '',
  },
];

export const TUTORIAL_TAGS = TUTORIALS.reduce<string[]>((acc, tutorial) => {
  tutorial.tags.forEach((tag) => {
    if (!acc.includes(tag)) {
      acc.push(tag);
    }
  });
  return acc;
}, []).sort();
