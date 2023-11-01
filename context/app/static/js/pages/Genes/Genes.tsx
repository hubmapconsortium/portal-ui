import React from 'react';

import Typography from '@mui/material/Typography';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import Summary from 'js/components/genes/Summary';
import GenePageProvider from 'js/components/genes/GenePageContext';
import { useGeneDetails } from './hooks';

const summaryId = 'Summary';

interface Props {
  geneSymbol: string;
}

function Genes({ geneSymbol }: Props) {
  const { data: geneData, isLoading } = useGeneDetails(geneSymbol);

  const shouldDisplaySection = {
    [summaryId]: true,
  };

  const sectionOrder = Object.entries(shouldDisplaySection)
    .filter(([, shouldDisplay]) => shouldDisplay)
    .map(([sectionName]) => sectionName);

  if (isLoading || !geneData) {
    return null;
  }

  return (
    <GenePageProvider geneSymbol={geneSymbol}>
      <DetailLayout sectionOrder={sectionOrder}>
        <Typography variant="subtitle1" component="h2" color="primary">
          Gene
        </Typography>
        <PageTitle>{`${geneSymbol.toUpperCase()} (${geneData.approved_name})`}</PageTitle>
        <Summary />
      </DetailLayout>
    </GenePageProvider>
  );
}

export default Genes;
