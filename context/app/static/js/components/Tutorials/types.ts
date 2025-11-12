import { DatabaseIcon, VisualizationIcon, WorkspacesIcon, SearchIcon, FeaturedIcon } from 'js/shared-styles/icons';
import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';
import tutorialsData from 'assets/json/tutorials.json';

export const TUTORIAL_CATEGORIES = ['Biomarker and Cell Type Search', 'Data', 'Visualization', 'Workspaces'] as const;

export type TutorialCategory = (typeof TUTORIAL_CATEGORIES)[number];

export interface TutorialCategoryData {
  title: TutorialCategory | 'Featured Tutorials';
  description: string;
  icon: MUIIcon;
  id: string;
}

export const TUTORIAL_CATEGORY_SECTIONS: ['Featured Tutorials', ...TutorialCategory[]] = [
  'Featured Tutorials',
  ...TUTORIAL_CATEGORIES,
];

export type TutorialCategorySection = (typeof TUTORIAL_CATEGORY_SECTIONS)[number];

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
    id: 'biomarker-and-cell-type-search',
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

export const TUTORIALS: Tutorial[] = tutorialsData as Tutorial[];

export const TUTORIAL_TAGS = TUTORIALS.reduce<string[]>((acc, tutorial) => {
  tutorial.tags.forEach((tag) => {
    if (!acc.includes(tag)) {
      acc.push(tag);
    }
  });
  return acc;
}, []).sort();
