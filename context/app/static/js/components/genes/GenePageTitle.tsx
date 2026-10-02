import React from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { capitalizeString } from 'js/helpers/functions';
import { useGeneOntology, useGenePageContext } from './hooks';

function GeneName() {
  const { geneSymbol } = useGenePageContext();
  const { data } = useGeneOntology();
  if (!data) {
    return geneSymbol.toUpperCase();
  }
  return `${capitalizeString(data.approved_name)} (${data.approved_symbol})`;
}

// Styled like PageTitle, but an h2: the "Gene" SummaryTitle above it is the page's h1.
function GenePageTitle() {
  return (
    <Typography variant="h2">
      <Stack direction="row">
        <GeneName />
      </Stack>
    </Typography>
  );
}

export default GenePageTitle;
