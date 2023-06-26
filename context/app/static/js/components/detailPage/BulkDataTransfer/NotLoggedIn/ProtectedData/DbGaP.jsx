import React from 'react';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InfoIcon from '@material-ui/icons/Info';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { StyledTypography } from './style';

function GlobusAccess() {
  return (
    <DetailSectionPaper>
      <StyledTypography variant="h5">
        Non-Consortium Members: Database of Genotypes and Phenotypes (dbGaP)
        <CheckCircleIcon style={{ color: '#6c8938' }} />
        <InfoIcon />
      </StyledTypography>
      <Typography variant="body2">
        This dataset contains protected-access human sequence data. If you are not a Consortium meber, you must access
        these data through dbGaP if available. dbGaP authentication is required for downloading through these links.
        View <a href="/">documentation</a> on how to attain dbGaP access.
      </Typography>
    </DetailSectionPaper>
  );
}

export default GlobusAccess;
