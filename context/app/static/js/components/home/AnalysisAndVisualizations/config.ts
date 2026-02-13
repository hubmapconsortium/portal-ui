import BarChartRounded from '@mui/icons-material/BarChartRounded';
import ScatterPlotRounded from '@mui/icons-material/ScatterPlot';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import { SlideConfig, MultiViewSlideConfig } from './types';
import { GeneIcon, WorkspacesIcon } from 'js/shared-styles/icons';

export const CLOUD_WORKSPACES_SLIDE: SlideConfig = {
  id: 'cloud-workspaces',
  theme: 'info',
  icon: WorkspacesIcon,
  title: 'Analyze Datasets in Cloud-based Workspaces',
  description:
    'Run your analyses directly in the browser with cloud-backed JupyterLab workspaces, eliminating the need for local setup or large dataset downloads.',
  bulletPoints: [
    'Python and R environments',
    'Library of 15+ pre-built templates',
    'GPU-enabled compute options',
    'Workspace sharing for reproducible collaboration',
  ],
  ctaButtons: [
    {
      label: 'Sign Up',
      href: '/register',
      variant: 'contained',
      trackingLabel: 'Cloud Workspaces / Sign Up',
    },
    {
      label: 'Launch Workspaces',
      href: '/workspaces',
      variant: 'outlined',
      trackingLabel: 'Cloud Workspaces / Launch Workspaces',
    },
  ],
  images: [
    {
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format',
      alt: 'Workspace template card showing CODEX data clustering',
      delay: 0,
    },
    {
      src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format',
      alt: 'JupyterLab notebook with data analysis code',
      delay: 0.15,
    },
    {
      src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format',
      alt: 'Interactive Vitessce visualization of spatial data',
      delay: 0.3,
    },
  ],
  layout: 'text-left',
};

export const BIOMARKERS_SLIDE: SlideConfig = {
  id: 'biomarkers',
  theme: 'warning',
  icon: GeneIcon,
  title: 'Discover More About Biomarkers and Cell Types',
  description:
    'Search by gene, pathway, protein, or cell type to discover relevant datasets, compare patterns, and dive into rich visualizations.',
  bulletPoints: [
    'Discover datasets that match your biological targets',
    'Compare patterns across studies',
    'Visualize gene expression, cell-type distributions, and other biologically meaningful signals at the dataset level',
  ],
  ctaButtons: [
    {
      label: 'Launch Advanced Search',
      href: '/cells',
      variant: 'contained',
      trackingLabel: 'Biomarkers / Launch Advanced Search',
    },
  ],
  images: [
    {
      src: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format',
      alt: 'Cell type distribution bar chart across kidney datasets',
      delay: 0,
    },
    {
      src: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format',
      alt: 'UMAP scatterplot with cell ontology annotations',
      delay: 0.15,
    },
    {
      src: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&auto=format',
      alt: 'Expression by cell set violin plot',
      delay: 0.3,
    },
  ],
  layout: 'text-right',
};

export const VISUALIZE_DATA_SLIDE: MultiViewSlideConfig = {
  id: 'visualize-data',
  sectionTitle: 'Visualize HuBMAP Data',
  icon: BarChartRounded,
  sectionDescription:
    'Visualize HuBMAP data with interactive tools for single-cell biology, spatial imaging, cell populations, and metadata exploration.',
  views: [
    {
      id: 'single-cell',
      theme: 'success',
      icon: BarChartRounded,
      title: 'Single-Cell and Spatial Data Visualizations',
      description: 'Visualize single-cell and spatial data with Vitessce',
      ctaButton: {
        label: 'View Visualizations',
        href: '/search?mapped_data_types[0]=scRNA-seq%20%5BSalmon%5D&entity_type[0]=Dataset',
        variant: 'contained',
        trackingLabel: 'Visualize / View Visualizations',
      },
      images: [
        {
          src: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=800&auto=format',
          alt: 'Vitessce spatial visualization with antigen list and heatmap',
          delay: 0,
        },
        {
          src: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format',
          alt: 'Vitessce cell sets and spatial imaging view',
          delay: 0.2,
        },
      ],
    },
    {
      id: 'cell-populations',
      theme: 'error',
      icon: ScatterPlotRounded,
      title: 'Cell Populations Viewer',
      description: 'Visualize cell populations of organs.',
      ctaButton: {
        label: 'Visualize Cell Populations',
        href: '/organ',
        variant: 'contained',
        trackingLabel: 'Visualize / Visualize Cell Populations',
      },
      images: [
        {
          src: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format',
          alt: 'Cell population counts histogram and dataset heatmap',
          delay: 0,
        },
        {
          src: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format',
          alt: 'Cell population tooltip with dataset and cell type details',
          delay: 0.2,
        },
      ],
    },
    {
      id: 'metadata',
      theme: 'info',
      icon: DescriptionRounded,
      title: 'Metadata Exploration',
      description: 'Dive deep into dataset metadata.',
      ctaButton: {
        label: 'Explore Data',
        href: '/lineup',
        variant: 'contained',
        trackingLabel: 'Visualize / Explore Data',
      },
      images: [
        {
          src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format',
          alt: 'LineUp metadata table with column summaries and filtering',
          delay: 0,
        },
        {
          src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format',
          alt: 'LineUp data collection sorting and filtering interface',
          delay: 0.2,
        },
      ],
    },
  ],
};
