import React from 'react';

import Typography from '@mui/material/Typography';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import Summary from 'js/components/genes/Summary';
import GenePageProvider from 'js/components/genes/GenePageContext';
import GenePageTitle from 'js/components/genes/GenePageTitle';

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
        <Typography variant="subtitle1" component="h2" color="primary">
          Gene
        </Typography>
        <GenePageTitle />
        <Summary />
      </DetailLayout>
    </GenePageProvider>
  );
}

export default Genes;
