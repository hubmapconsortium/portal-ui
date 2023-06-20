import React from 'react';
import Typography from '@material-ui/core/Typography';

import { PageWrapper, StyledDescription } from './style';

function PanelListLandingPage({ title, subtitle, description, children }) {
  return (
    <PageWrapper>
      <Typography variant="h2" component="h1" data-testid="landing-page-title">
        {title}
      </Typography>
      <Typography variant="subtitle1" color="primary" data-testid="landing-page-subtitle">
        {subtitle}
      </Typography>
      <StyledDescription data-testid="landing-page-description">{description}</StyledDescription>
      {children}
    </PageWrapper>
  );
}

export default PanelListLandingPage;
