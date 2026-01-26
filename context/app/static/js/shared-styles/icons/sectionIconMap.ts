import SvgIcon from '@mui/material/SvgIcon';
import {
  AnalysisDetailsIcon,
  AttributionIcon,
  BulkDataIcon,
  CellTypeIcon,
  CollectionIcon,
  DatasetIcon,
  FeaturedIcon,
  FileIcon,
  GeneIcon,
  MetadataIcon,
  OrganIcon,
  ProcessedDataIcon,
  ProvenanceIcon,
  PublicationIcon,
  SampleIcon,
  SearchIcon,
  SentIcon,
  SummaryIcon,
  VisualizationIcon,
  WorkspacesIcon,
} from './icons';
import { externalIconMap } from './externalImageIcons';

export const sectionIconMap: Record<string, typeof SvgIcon> = {
  summary: SummaryIcon,
  metadata: MetadataIcon,
  'processed-data': ProcessedDataIcon,
  'integrated-data': ProcessedDataIcon,
  visualization: VisualizationIcon,
  visualizations: VisualizationIcon, // Publications use this key
  files: FileIcon,
  'integrated-maps': FileIcon,
  'protocols-and-workflow-details': AnalysisDetailsIcon,
  protocols: AnalysisDetailsIcon, // Donors/Samples use this key
  tissue: OrganIcon, // Samples use this key
  organs: OrganIcon, // Genes use this key
  'bulk-data-transfer': BulkDataIcon,
  provenance: ProvenanceIcon,
  collections: CollectionIcon,
  attribution: AttributionIcon,
  authors: AttributionIcon, // Publications use this key
  contributors: AttributionIcon, // Collections use this key
  data: DatasetIcon,
  'derived-data': ProcessedDataIcon, // Donors/Samples use this key
  'biomarker-query': DatasetIcon, // Genes use this key
  datasets: DatasetIcon, // Collections use this key
  'cell-type-distribution': VisualizationIcon, // Cell Types use this key
  biomarkers: GeneIcon, // Cell Types use this key
  'reference-based-analysis': VisualizationIcon,
  assays: DatasetIcon,
  samples: SampleIcon,
  'cell-population-plot': CellTypeIcon,
  'cell-types': CellTypeIcon,
  'sent-invitations-status': SentIcon,
  templates: WorkspacesIcon,
  publications: PublicationIcon,
  // Tutorials
  workspaces: WorkspacesIcon,
  'featured-tutorials': FeaturedIcon,
  'biomarker-and-cell-type-search': SearchIcon,
} as const;

export const sectionImageIconMap: Record<string, keyof typeof externalIconMap> = {
  'human-reference-atlas': 'hra',
};
