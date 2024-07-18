import SvgIcon from '@mui/material/SvgIcon';
import {
  AnalysisDetailsIcon,
  AttributionIcon,
  BulkDataIcon,
  CollectionIcon,
  FileIcon,
  MetadataIcon,
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
  files: FileIcon,
  analysis: AnalysisDetailsIcon,
  'bulk-data-transfer': BulkDataIcon,
  provenance: ProvenanceIcon,
  collections: CollectionIcon,
  attribution: AttributionIcon,
};
