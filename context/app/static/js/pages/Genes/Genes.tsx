import React from 'react';

import DetailLayout from 'js/components/detailPage/DetailLayout';
import Summary from 'js/components/genes/Summary';
import GenePageProvider from 'js/components/genes/GenePageContext';
import GenePageTitle from 'js/components/genes/GenePageTitle';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';
import BiomarkerQuery from 'js/components/genes/BiomarkerQuery';
import Organs from 'js/components/genes/Organs';

import { pageSectionIDs } from 'js/components/genes/constants';
import CellTypes from 'js/components/genes/CellTypes/CellTypes';

const { summary, biomarkerQuery, organs, cellTypes } = pageSectionIDs;

const shouldDisplaySection = {
  [summary]: true,
  [cellTypes]: false,
  [organs]: true,
  [biomarkerQuery]: true,
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
        {shouldDisplaySection[organs] && <Organs />}
        {shouldDisplaySection[biomarkerQuery] && <BiomarkerQuery />}
      </DetailLayout>
    </GenePageProvider>
  );
}

export default GeneDetails;
