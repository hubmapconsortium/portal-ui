import React from 'react';
import Typography from '@mui/material/Typography';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { StyledDiv } from './style';

function Title() {
  return (
    <StyledDiv>
      <PageTitle>Human BioMolecular Atlas Program Data Portal</PageTitle>
      <Typography variant="h4" component="h2" color="secondary">
        An open platform to discover, visualize and download standardized healthy single-cell tissue data
      </Typography>
    </StyledDiv>
  );
}

export default React.memo(Title);
