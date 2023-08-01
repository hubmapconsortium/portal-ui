import React from 'react';
import Typography from '@material-ui/core/Typography';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { StyledDiv } from './style';

function Title() {
  return (
    <StyledDiv>
      <PageTitle>Human BioMolecular Atlas Program</PageTitle>
      <Typography variant="h4" component="h2" color="secondary">
        An open, global atlas of the human body at the cellular level
      </Typography>
    </StyledDiv>
  );
}

export default React.memo(Title);
