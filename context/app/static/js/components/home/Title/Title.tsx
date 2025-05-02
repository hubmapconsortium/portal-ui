import React from 'react';
import Typography from '@mui/material/Typography';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { StyledDiv } from './style';

function Title() {
  return (
    <StyledDiv>
      <PageTitle data-testid="home-page-title">Human BioMolecular Atlas Program Data Portal</PageTitle>
      <Typography variant="h5" component="h2" color="secondary">
        An open platform to discover, visualize and download standardized healthy single-cell and spatial tissue data
      </Typography>
    </StyledDiv>
  );
}

export default React.memo(Title);
