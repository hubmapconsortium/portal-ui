import React from 'react';

import Typography from '@mui/material/Typography';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { getSections } from 'js/shared-styles/sections/TableOfContents/utils';
import Summary from 'js/components/genes/Summary';
import { FlexRow, Content } from './style';
import { useGeneCommonName, useGeneData } from './hooks';

const summaryId = 'Summary';

function Genes({ geneSymbol }) {
  const { geneCommonName, isLoading } = useGeneCommonName(geneSymbol);
  const geneSummary = useGeneData(geneSymbol);

  const shouldDisplaySection = {
    [summaryId]: true,
  };

  const sectionOrder = Object.entries(shouldDisplaySection)
    .filter(([, shouldDisplay]) => shouldDisplay)
    .map(([sectionName]) => sectionName);
  const sections = new Map(getSections(sectionOrder));

  if (isLoading) {
    return null;
  }

  return (
    <FlexRow>
      <TableOfContents items={[...sections.values()]} />
      <Content>
        <Typography variant="subtitle1" component="h2" color="primary">
          Gene
        </Typography>
        <PageTitle>{`${geneSymbol.toUpperCase()} (${geneCommonName})`}</PageTitle>
        <Summary geneSummary={geneSummary} />
      </Content>
    </FlexRow>
  );
}

export default Genes;