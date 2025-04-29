import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import PanelList from 'js/shared-styles/panels/PanelList';
import Description from 'js/shared-styles/sections/Description';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import { useCollections } from './hooks';

const descriptions = {
  header:
    'HuBMAP collections group datasets from related experiments, such as assays performed on the same organ or datasets with shared research relevance. Each collection is assigned a Document Object Identifier (DOI) for citation and reference.',
  subheader:
    'Explore collections of HuBMAP datasets. This table can be downloaded in TSV format. Collection pages provide context on why the datasets are grouped and include a list of the associated HuBMAP datasets.',
};

function Collections() {
  const panelsProps = useCollections();
  return (
    <Stack spacing={3} marginBottom={4}>
      <Stack spacing={1}>
        <PageTitle>Collections</PageTitle>
        <Typography variant="subtitle1" color="primary" data-testid="landing-page-subtitle">
          {panelsProps.length > 0 ? `${panelsProps.length} Collections` : undefined}
        </Typography>
        <Description data-testid="landing-page-description">{descriptions.header}</Description>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h4" marginTop={4}>
          Collections of HuBMAP Data
        </Typography>
        <Description>{descriptions.subheader}</Description>
        <PanelList panelsProps={panelsProps} />
      </Stack>
    </Stack>
  );
}

export default Collections;
