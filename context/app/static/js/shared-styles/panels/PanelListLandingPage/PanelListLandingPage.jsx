import React from 'react';
import Typography from '@mui/material/Typography';

import { PageWrapper, StyledDescription } from './style';

function PanelListLandingPage({ title, subtitle, description, children }) {
  return (
    <PageWrapper>
      <Typography variant="h2" component="h1">
        {title}
      </Typography>
      <Typography variant="subtitle1" color="primary">
        {subtitle}
      </Typography>
      <StyledDescription>{description}</StyledDescription>
      {children}
    </PageWrapper>
  );
}

export default PanelListLandingPage;
