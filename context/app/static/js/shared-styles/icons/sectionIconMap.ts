import SvgIcon from '@mui/material/SvgIcon';
import {
  AnalysisDetailsIcon,
  AttributionIcon,
  BulkDataIcon,
  CollectionIcon,
  DatasetIcon,
  FileIcon,
  GeneIcon,
  MetadataIcon,
  OrganIcon,
  ProcessedDataIcon,
  ProvenanceIcon,
  SummaryIcon,
  VisualizationIcon,
} from './icons';

export const sectionIconMap: Record<string, typeof SvgIcon> = {
  summary: SummaryIcon,
  metadata: MetadataIcon,
  'processed-data': ProcessedDataIcon,
  visualization: VisualizationIcon,
  visualizations: VisualizationIcon, // Publications use this key
  files: FileIcon,
  analysis: AnalysisDetailsIcon,
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
  'derived-data': DatasetIcon, // Donors/Samples use this key
  'biomarker-query': DatasetIcon, // Genes use this key
  datasets: DatasetIcon, // Collections use this key
  'distribution-across-organs': VisualizationIcon, // Cell Types use this key
  biomarkers: GeneIcon, // Cell Types use this key
} as const;
