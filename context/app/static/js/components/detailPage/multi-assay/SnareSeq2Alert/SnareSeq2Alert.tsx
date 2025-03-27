import React from 'react';

import { DetailPageAlert } from 'js/components/detailPage/style';
import { useIsMultiAssay } from '../hooks';

function SnareSeq2Alert() {
  const { isSnareSeq2 } = useIsMultiAssay();

  if (!isSnareSeq2) {
    return null;
  }

  return (
    <DetailPageAlert
      severity="info"
      sx={{
        '.MuiAlert-message': {
          flexGrow: 1,
        },
      }}
    >
      SNARE-seq2 processed datasets are derived from multiple primary raw datasets. You are currently viewing one of
      these raw SNARE-seq2 datasets. SNARE-seq2 datasets are multi-assay datasets comprised of RNA-seq and ATAC-seq
      datasets. For a detailed understanding of dataset relationships, scroll down to the Dataset Relationship section
      or explore the provenance graph.
    </DetailPageAlert>
  );
}

export default SnareSeq2Alert;
