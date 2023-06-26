import React from 'react';
import Typography from '@material-ui/core/Typography';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { StyledTypography } from './style';

function ProtectedData() {
  return (
    <DetailSectionPaper>
      <StyledTypography variant="h6">Bulk Data Transfer</StyledTypography>
      <Typography variant="body2">This data is protected and requires you to be logged in to access it.</Typography>
    </DetailSectionPaper>
  );
}

export default ProtectedData;
