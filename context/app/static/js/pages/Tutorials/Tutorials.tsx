import React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import SelectableCard from 'js/shared-styles/cards/SelectableCard';

const tutorials = {
  workspaces: {
    title: 'Workspaces',
    route: 'workspaces',
    description:
      'Learn how to set up workspaces that allows you to run analysis on HuBMAP data with Jupyter notebooks.',
    tags: ['Workspaces', 'Data Analysis'],
  },
};

const StyledLink = styled('a')(({ theme }) => ({
  h6: {
    color: theme.palette.common.link,
  },
}));

function Tutorials() {
  return (
    <Stack spacing={2}>
      <PageTitle>Tutorials</PageTitle>
      <SectionPaper>Browse tutorials of how to navigate the HuBMAP Data Portal for your specific needs.</SectionPaper>
      <Grid container alignItems="stretch">
        {Object.values(tutorials).map(({ title, description, tags, route }) => (
          <Grid item xs={4} key={title} aria-label={`${title} tutorial`}>
            <StyledLink href={`/tutorials/${route}`}>
              <SelectableCard title={title} description={description} cardKey={title} tags={tags} />
            </StyledLink>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default Tutorials;
