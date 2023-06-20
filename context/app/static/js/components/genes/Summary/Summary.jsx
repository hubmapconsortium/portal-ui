import React from 'react';
import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryBody from 'js/components/genes/SummaryBody/SummaryBody';

function Summary({ geneSummary }) {
  return (
    <DetailPageSection id="summary">
      <SummaryBody geneSummary={geneSummary} />
    </DetailPageSection>
  );
}

export default Summary;
