import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';
import {
  OrganIcon,
  CellTypeIcon,
  GeneIcon,
  DatasetIcon,
  PublicationIcon,
  VisualizationIcon,
} from 'js/shared-styles/icons';
import TipsAndUpdatesRounded from '@mui/icons-material/TipsAndUpdatesRounded';

interface HeroCardConfig {
  title: string;
  description: string;
  href: string;
  icon: MUIIcon;
}

export const HERO_CARDS: HeroCardConfig[] = [
  {
    title: 'Organs',
    description: 'Browse data organized by human organ systems and anatomical structures.',
    href: '/organs',
    icon: OrganIcon,
  },
  {
    title: 'Cell Types',
    description: 'Explore single-cell data across diverse cell populations.',
    href: '/cell-types',
    icon: CellTypeIcon,
  },
  {
    title: 'Biomarkers',
    description: 'Search gene expression patterns and molecular signatures across tissues.',
    href: '/biomarkers',
    icon: GeneIcon,
  },
];

export interface BottomBarItem {
  label: string;
  anchorId: string;
  icon: MUIIcon;
  desktopOnly?: boolean;
}

export const BOTTOM_BAR_ITEMS: BottomBarItem[] = [
  { label: 'Datasets', anchorId: 'hubmap-datasets', icon: DatasetIcon, desktopOnly: true },
  { label: 'Analysis and Visualizations', anchorId: 'analysis-and-visualizations', icon: VisualizationIcon },
  { label: 'Publications', anchorId: 'publications', icon: PublicationIcon },
  { label: 'Testimonials', anchorId: 'testimonials', icon: TipsAndUpdatesRounded },
];

export const BACKGROUND_CYCLE_INTERVAL_MS = 6000;
export const BACKGROUND_FADE_DURATION_MS = 3000;

export const BACKGROUND_COLORS = ['#e8eaf6', '#f3e5f5', '#e3f2fd'] as const;
