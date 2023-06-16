import React from 'react';
import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryBody from 'js/components/genes/SummaryBody/SummaryBody';

function Summary({ geneSummary, NCBIgeneId, HUGOgeneId }) {
  return (
    <DetailPageSection id="summary">
      <SummaryBody geneSummary={geneSummary} NCBIgeneId={NCBIgeneId} HUGOgeneId={HUGOgeneId} />
    </DetailPageSection>
  );
}

export default Summary;
