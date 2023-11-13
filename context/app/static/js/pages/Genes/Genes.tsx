import React from 'react';

import DetailLayout from 'js/components/detailPage/DetailLayout';
import Summary from 'js/components/genes/Summary';
import GenePageProvider from 'js/components/genes/GenePageContext';
import GenePageTitle from 'js/components/genes/GenePageTitle';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';
import BiomarkerQuery from 'js/components/genes/BiomarkerQuery';
import Azimuth from 'js/components/genes/Azimuth';

import { pageSectionIDs } from 'js/components/genes/constants';
import CellTypes from 'js/components/genes/CellTypes/CellTypes';

const { summary, biomarkerQuery, azimuth, cellTypes } = pageSectionIDs;

const shouldDisplaySection = {
  [summary]: true,
  [biomarkerQuery]: true,
  [azimuth]: false, // TODO: Toggle back on
  [cellTypes]: true,
};

const sectionOrder = Object.entries(shouldDisplaySection)
  .filter(([, shouldDisplay]) => shouldDisplay)
  .map(([sectionName]) => sectionName);

interface Props {
  geneSymbol: string;
}

function GeneDetails({ geneSymbol }: Props) {
  return (
    <GenePageProvider geneSymbol={geneSymbol}>
      <DetailLayout sectionOrder={sectionOrder}>
        <SummaryTitle iconTooltipText="Basic unit of heredity made up of sequences of DNA">Gene</SummaryTitle>
        <GenePageTitle />
        <Summary />
        <BiomarkerQuery />
        {shouldDisplaySection.azimuth && <Azimuth />}
        <CellTypes />
      </DetailLayout>
    </GenePageProvider>
  );
}

export default GeneDetails;
