import React from 'react';
import Typography from '@material-ui/core/Typography';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { StyledTypography } from './style';

function ProtectedData() {
  return (
    <DetailSectionPaper>
      <StyledTypography variant="h5">HuBMAP Consortium Members: Globus Access</StyledTypography>
      <Typography variant="body2">
        Please log in for Globus access or email
        <a href="mailto:help@hubmapconsortium.org"> help@hubmapconsortium.org </a>
        with the dataset ID about the files you are trying to access.
      </Typography>
    </DetailSectionPaper>
  );
}

export default ProtectedData;
