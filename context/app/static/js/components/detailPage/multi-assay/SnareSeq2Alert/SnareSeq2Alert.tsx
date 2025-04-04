import React from 'react';

import { DetailPageAlert } from 'js/components/detailPage/style';
import { InternalLink } from 'js/shared-styles/Links';
import { useIsMultiAssay } from '../hooks';

interface SnareSeq2AlertProps {
  isHeader?: boolean;
}

const headerText = `SNARE-seq2 processed datasets are derived from multiple primary raw datasets. You are currently viewing one of these raw SNARE-seq2 datasets. SNARE-seq2 datasets are multi-assay datasets comprised of RNA-seq and ATAC-seq datasets.`;
const bulkDataSectionText = `SNARE-seq2 processed datasets are derived from multiple primary raw datasets. All relevant primary raw datasets are available for download in this section, depending on your access permissions.`;

function SnareSeq2Alert({ isHeader }: SnareSeq2AlertProps) {
  const { isSnareSeq2 } = useIsMultiAssay();

  if (!isSnareSeq2) {
    return null;
  }

  const descriptionText = isHeader ? headerText : bulkDataSectionText;

  return (
    <DetailPageAlert
      severity="info"
      sx={{
        '.MuiAlert-message': {
          flexGrow: 1,
        },
      }}
    >
      {descriptionText} For a detailed understanding of dataset relationships, scroll to the{' '}
      <InternalLink href="#section-dataset-relationships">Dataset Relationship section</InternalLink> or explore the{' '}
      <InternalLink href="#provenance">provenance</InternalLink> graph.
    </DetailPageAlert>
  );
}

export default SnareSeq2Alert;
