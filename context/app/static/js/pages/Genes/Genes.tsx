import React from 'react';

import DetailLayout from 'js/components/detailPage/DetailLayout';
import Summary from 'js/components/genes/Summary';
import GenePageProvider from 'js/components/genes/GenePageContext';
import GenePageTitle from 'js/components/genes/GenePageTitle';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';

const summaryId = 'Summary';

interface Props {
  geneSymbol: string;
}

function Genes({ geneSymbol }: Props) {
  const shouldDisplaySection = {
    [summaryId]: true,
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
      </DetailLayout>
    </GenePageProvider>
  );
}

export default Genes;
