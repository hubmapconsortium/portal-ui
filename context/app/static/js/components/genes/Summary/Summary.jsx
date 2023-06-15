import React from 'react';
import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryBody from 'js/components/genes/SummaryBody/SummaryBody';

function Summary({ geneSummary, geneId }) {
  return (
    <DetailPageSection id="summary">
      <SummaryBody geneSummary={geneSummary} geneId={geneId} />
    </DetailPageSection>
  );
}

export default Summary;
