import React from 'react';
import Typography from '@material-ui/core/Typography';

import { StyledDiv } from './style';

function Title() {
  return (
    <StyledDiv>
      <Typography variant="h2" component="h1">
        Human BioMolecular Atlas Program
      </Typography>
      <Typography variant="h4" component="h2" color="secondary">
        An open, global atlas of the human body at the cellular level
      </Typography>
    </StyledDiv>
  );
}

export default React.memo(Title);
