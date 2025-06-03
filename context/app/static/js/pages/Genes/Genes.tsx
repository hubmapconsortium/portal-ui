import React from 'react';

import DetailLayout from 'js/components/detailPage/DetailLayout';
import Summary from 'js/components/genes/Summary';
import GenePageProvider from 'js/components/genes/GenePageContext';
import GenePageTitle from 'js/components/genes/GenePageTitle';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';
import Datasets from 'js/components/genes/Datasets';

import { pageSectionIDs } from 'js/components/genes/constants';
import CellTypes from 'js/components/genes/CellTypes/GeneCellTypes';

const { summary, datasets, cellTypes } = pageSectionIDs;

const shouldDisplaySection = {
  [summary]: true,
  [cellTypes]: true,
  [datasets]: true,
};

interface Props {
  geneSymbol: string;
}

function GeneDetails({ geneSymbol }: Props) {
  return (
    <GenePageProvider geneSymbol={geneSymbol}>
      <DetailLayout sections={shouldDisplaySection}>
        <SummaryTitle entityIcon="Gene">Gene</SummaryTitle>
        <GenePageTitle />
        {shouldDisplaySection[summary] && <Summary />}
        {shouldDisplaySection[cellTypes] && <CellTypes />}
        {shouldDisplaySection[datasets] && <Datasets />}
      </DetailLayout>
    </GenePageProvider>
  );
}

export default GeneDetails;
