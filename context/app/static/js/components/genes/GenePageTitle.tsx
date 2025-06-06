import React from 'react';

import Stack from '@mui/material/Stack';

import PageTitle from 'js/shared-styles/pages/PageTitle';

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

function GenePageTitle() {
  return (
    <PageTitle>
      <Stack direction="row">
        <GeneName />
      </Stack>
    </PageTitle>
  );
}

export default GenePageTitle;
