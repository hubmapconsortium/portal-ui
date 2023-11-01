import React from 'react';

import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import PageTitle from 'js/shared-styles/pages/PageTitle';

import { useGeneDetails } from './hooks';
import { useGenePageContext } from './GenePageContext';

function GeneSymbol() {
  const { geneSymbol } = useGenePageContext();
  return <>{geneSymbol.toUpperCase()}</>;
}

function GeneName() {
  const { data } = useGeneDetails();
  if (!data) {
    return <Skeleton variant="rounded" width={160} sx={{ display: 'inline-block' }} />;
  }
  return data.approved_name;
}

function GenePageTitle() {
  return (
    <PageTitle>
      <Stack direction="row">
        <GeneSymbol /> (<GeneName />)
      </Stack>
    </PageTitle>
  );
}

export default GenePageTitle;
