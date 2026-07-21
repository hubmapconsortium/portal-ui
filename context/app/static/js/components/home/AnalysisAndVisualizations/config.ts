import BarChartRounded from '@mui/icons-material/BarChartRounded';
import ScatterPlotRounded from '@mui/icons-material/ScatterPlot';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import { SlideConfig, MultiViewSlideConfig } from './types';
import { DatasetIcon, GeneIcon, WorkspacesIcon, FileIcon } from 'js/shared-styles/icons';

export const DATASETS_SEARCH_SLIDE: SlideConfig = {
  id: 'datasets-search',
  theme: 'info',
  icon: DatasetIcon,
  title: 'Find Data Your Way',
  description: [
    'Filter your way through 9,000+ datasets across 40+ facets with organs, assays, donor demographics, and more.',
    'Or just ask directly. Chat with Say & See mode about donor, sample, or dataset metadata and get instant interactive visualizations.',
  ],
  ctaButtons: [
    {
      label: 'Explore Datasets',
      href: '/search/datasets',
      variant: 'contained',
      trackingLabel: 'Datasets Search / Explore Datasets',
    },
    {
      label: 'Chat with Say & See',
      href: '/search/datasets?mode=say-see',
      variant: 'outlined',
      trackingLabel: 'Datasets Search / Chat with Say & See',
    },
  ],
  images: [
    {
      videoSrc: `${CDN_URL}/v3/datasets_search.webm`,
      src: '',
      alt: 'Dataset search page with filters and Say & See chat mode',
      delay: 0,
    },
  ],
  layout: 'text-left',
};

export const CLOUD_WORKSPACES_SLIDE: SlideConfig = {
  id: 'cloud-workspaces',
  theme: 'success',
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
      href: 'https://hubmapconsortium.org/workspaces-sign-up/',
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
      videoSrc: `${CDN_URL}/v3/workspaces.webm`,
      src: '',
      alt: 'Workspace template card showing CODEX data clustering',
      delay: 0,
    },
  ],
  layout: 'text-right',
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
      videoSrc: `${CDN_URL}/v3/biomarkers.webm`,
      src: '',
      alt: 'Cell type distribution bar chart across kidney datasets',
      delay: 0,
    },
  ],
  layout: 'text-left',
};

export const VISUALIZE_DATA_SLIDE: MultiViewSlideConfig = {
  id: 'visualize-data',
  sectionTitle: 'Explore HuBMAP Data',
  icon: BarChartRounded,
  sectionDescription:
    'Explore HuBMAP data with interactive tools for single-cell biology, spatial imaging, cell populations, and metadata exploration.',
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
      // Rendered as an embla carousel (VitessceCarousel). `images` is unused for this view.
      images: [],
      carousel: [
        {
          src: `${CDN_URL}/v3/vitessce_codex.webp`,
          alt: 'Vitessce spatial visualization with antigen list and heatmap',
          href: '/browse/dataset/f86b9efc87074bf03cd53932d8f1e76f?viz=hbm373.ldgf.766&fullscreen=true&vitessce-conf=codex',
          assay: 'CODEX/PhenoCycler',
          analyte: 'Proteins',
        },
        {
          src: `${CDN_URL}/v3/vitessce_mibi.webp`,
          alt: 'Vitessce MIBI multiplexed imaging view',
          href: '/browse/dataset/52fdfc42c12514f8a04a09577f840a27?viz=hbm252.pslx.399&fullscreen=true&vitessce-conf=mibi',
          assay: 'MIBI',
          analyte: 'Proteins',
        },
        {
          src: `${CDN_URL}/v3/vitessce_slideseq.webp`,
          alt: 'Vitessce Slide-seq spatial transcriptomics view',
          href: '/browse/dataset/c50093802e7d31ff8c884440d95a5271?viz=hbm827.mjmm.447&fullscreen=true&vitessce-conf=slideseq',
          assay: 'Slideseq',
          analyte: 'RNA',
        },
        {
          src: `${CDN_URL}/v3/vitessce_rnaseq_snrnaseq.webp`,
          alt: 'Vitessce single-cell RNA-seq cell sets and scatterplot',
          href: '/browse/dataset/c858b21d7bbfbe4e73d9f72c2c719c62?viz=hbm688.rpfc.258&fullscreen=true&vitessce-conf=rnaseq_snrnaseq',
          assay: 'RNAseq / snRNAseq',
          analyte: 'RNA',
        },

        {
          src: `${CDN_URL}/v3/vitessce_3d_tissue_maps.webp`,
          alt: 'Vitessce 3D tissue map with volumetric rendering',
          href: '/preview/3d-tissue-maps?fullscreen=true&vitessce-conf=3d_tissue_maps',
          assay: '3D Tissue Maps',
          analyte: 'Proteins',
        },
        {
          src: `${CDN_URL}/v3/vitessce_atacseq.webp`,
          alt: 'Vitessce ATAC-seq chromatin accessibility view',
          href: '/browse/dataset/e4b371ea3ed4c3ca77791b34b829803f?viz=hbm573.gzns.837&fullscreen=true&vitessce-conf=atacseq',
          assay: 'ATACseq',
          analyte: 'DNA / Chromatin accessibility',
        },
        {
          src: `${CDN_URL}/v3/vitessce_desi_lcms.webp`,
          alt: 'Vitessce DESI / LC-MS mass spectrometry imaging view',
          href: '/browse/dataset/b2c7a142d1a88af612af7db3f64fb300?viz=hbm345.vqqz.258&fullscreen=true&vitessce-conf=desi_lcms',
          assay: 'DESI / LC-MS',
          analyte: 'Metabolites / Lipids',
        },
        {
          src: `${CDN_URL}/v3/vitessce_histology.webp`,
          alt: 'Vitessce histology image view',
          href: '/browse/dataset/e885a9045e07e6f928ab85f6b83604f8?viz=hbm249.kjdb.399&fullscreen=true&vitessce-conf=histology',
          assay: 'Histology',
          analyte: 'Morphology / Nucleic Acids / Proteins',
        },
        {
          src: `${CDN_URL}/v3/vitessce_light_sheet.webp`,
          alt: 'Vitessce light sheet microscopy 3D view',
          href: '/browse/dataset/8ffd2daf21c1d840b52a9e2da1a9d818?viz=hbm669.mtrz.833&fullscreen=true&vitessce-conf=light_sheet',
          assay: 'Light Sheet',
          analyte: 'Morphology / Nucleic Acids / Proteins',
        },
        {
          src: `${CDN_URL}/v3/vitessce_maldi_ims.webp`,
          alt: 'Vitessce MALDI imaging mass spectrometry view',
          href: '/browse/dataset/574c32bbdb7fc662d351976584d8df4c?viz=hbm428.zcks.526&fullscreen=true&vitessce-conf=maldi_ims',
          assay: 'MALDI IMS',
          analyte: 'Lipids / Metabolites',
        },
        {
          src: `${CDN_URL}/v3/vitessce_seqfish.webp`,
          alt: 'Vitessce seqFISH spatial transcriptomics view',
          href: '/browse/dataset/bf447e198a99cb780d93437f05b2452d?viz=hbm532.nbjw.749&fullscreen=true&vitessce-conf=seqfish',
          assay: 'seqFISH',
          analyte: 'RNA',
        },
        {
          src: `${CDN_URL}/v3/vitessce_visium.webp`,
          alt: 'Vitessce Visium spatial transcriptomics view',
          href: '/browse/dataset/e979bf2fe32fbae81d23eb5f89c83d34?viz=hbm843.ddsj.637&fullscreen=true&vitessce-conf=visium',
          assay: 'Visium',
          analyte: 'RNA / Morphology',
        },
        // TODO: There are no published GeoMX visualizations yet, add one when ready
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
      imageCta: {
        label: 'Visualize Kidney Cell Populations',
        href: '/organs/kidney#cell-population-plot',
        trackingLabel: 'Visualize / Visualize Kidney Cell Populations',
      },
      images: [
        {
          src: `${CDN_URL}/v3/scellop_kidney.webp`,
          alt: 'Cell population plot for kidney datasets',
          delay: 0,
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
        href: '/lineup/datasets',
        variant: 'contained',
        trackingLabel: 'Visualize / Explore Data',
      },
      images: [
        {
          src: `${CDN_URL}/v3/lineup_datasets.webp`,
          alt: 'LineUp metadata table with column summaries and filtering',
          delay: 0,
        },
      ],
    },
    {
      id: 'integrated-maps',
      theme: 'warning',
      icon: FileIcon,
      title: 'Integrated Maps',
      description: 'Analyze consolidated data given a particular assay type and tissue.',
      ctaButton: {
        label: 'Download Integrated Maps',
        href: '/integrated-maps',
        variant: 'contained',
        trackingLabel: 'Visualize / Download Integrated Maps',
      },
      images: [
        {
          src: `${CDN_URL}/v3/integrated_maps.webp`,
          alt: 'Integrated map of consolidated data for an assay type and tissue',
          delay: 0,
        },
      ],
    },
  ],
};
