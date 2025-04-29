import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Description from 'js/shared-styles/sections/Description';

const description =
  'Explore collections of HuBMAP datasets. This table can be downloaded in TSV format. Collection pages provide context on why the datasets are grouped and include a list of the associated HuBMAP datasets.';

export default function CollectionsDescription() {
  return (
    <Stack spacing={2} marginBottom={2}>
      <Typography variant="h4">Collections of HuBMAP Data</Typography>
      <Description>{description}</Description>
    </Stack>
  );
}
