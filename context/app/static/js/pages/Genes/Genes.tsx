import React from 'react';

import DetailLayout from 'js/components/detailPage/DetailLayout';
import Summary from 'js/components/genes/Summary';
import GenePageProvider from 'js/components/genes/GenePageContext';
import GenePageTitle from 'js/components/genes/GenePageTitle';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';
import BiomarkerQuery from 'js/components/genes/BiomarkerQuery/BiomarkerQuery';

const summaryId = 'summary';
const biomarkerQueryId = 'biomarker-query';

interface Props {
  geneSymbol: string;
}

function GeneDetails({ geneSymbol }: Props) {
  const shouldDisplaySection = {
    [summaryId]: true,
    [biomarkerQueryId]: true,
  };

  const sectionOrder = Object.entries(shouldDisplaySection)
    .filter(([, shouldDisplay]) => shouldDisplay)
    .map(([sectionName]) => sectionName);

  return (
    <GenePageProvider geneSymbol={geneSymbol}>
      <DetailLayout sectionOrder={sectionOrder}>
        <SummaryTitle iconTooltipText="Basic unit of heredity made up of sequences of DNA">Gene</SummaryTitle>
        <GenePageTitle />
        <Summary />
        <BiomarkerQuery />
      </DetailLayout>
    </GenePageProvider>
  );
}

export default GeneDetails;
