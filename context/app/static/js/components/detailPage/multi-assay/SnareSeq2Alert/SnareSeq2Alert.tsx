import React from 'react';
import Button from '@mui/material/Button';

import { DetailPageAlert } from 'js/components/detailPage/style';
import { PROVENANCE_GRAPH_ID } from 'js/components/detailPage/provenance/ProvTabs/utils';
import { InternalLink } from 'js/shared-styles/Links';
import { useProcessedDatasets } from 'js/pages/Dataset/hooks';
import { datasetSectionId } from 'js/pages/Dataset/utils';
import { useIsMultiAssay } from '../hooks';

interface SnareSeq2AlertProps {
  isHeader?: boolean;
}

const headerText = `SNARE-seq2 processed datasets are derived from multiple primary raw datasets. You are currently viewing one of these raw SNARE-seq2 datasets. SNARE-seq2 datasets are multi-assay datasets comprised of RNA-seq and ATAC-seq datasets.`;
const bulkDataSectionText = `SNARE-seq2 processed datasets are derived from multiple primary raw datasets. All relevant primary raw datasets are available for download in this section, depending on your access permissions.`;

function SnareSeq2Alert({ isHeader }: SnareSeq2AlertProps) {
  const { isSnareSeq2 } = useIsMultiAssay();
  // Only populated on raw datasets, which is the only place the header alert appears.
  const { searchHits: processedDatasets } = useProcessedDatasets();

  if (!isSnareSeq2) {
    return null;
  }

  const descriptionText = isHeader ? headerText : bulkDataSectionText;

  // A single processed dataset gets a direct link, which also expands its accordion.
  const processedHref =
    processedDatasets.length === 1
      ? `#${datasetSectionId(processedDatasets[0]._source, 'section')}`
      : '#processed-data';

  const showProcessedDatasetButton = Boolean(isHeader) && processedDatasets.length > 0;

  return (
    <DetailPageAlert
      severity="info"
      sx={{
        '.MuiAlert-message': {
          flexGrow: 1,
        },
      }}
      action={
        showProcessedDatasetButton ? (
          <Button href={processedHref} sx={{ flexShrink: 0 }}>
            View Processed Dataset
          </Button>
        ) : undefined
      }
    >
      {descriptionText} For a detailed understanding of dataset relationships, scroll to the{' '}
      <InternalLink href="#section-dataset-relationships">Dataset Relationship section</InternalLink> or explore the{' '}
      <InternalLink href={`#${PROVENANCE_GRAPH_ID}`}>provenance</InternalLink> graph.
    </DetailPageAlert>
  );
}

export default SnareSeq2Alert;
