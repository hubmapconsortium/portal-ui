import React from 'react';
import Typography from '@material-ui/core/Typography';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { PageWrapper, StyledDescription } from './style';

function PanelListLandingPage({ title, subtitle, description, children }) {
  return (
    <PageWrapper>
      <PageTitle data-testid="landing-page-title">{title}</PageTitle>
      <Typography variant="subtitle1" color="primary" data-testid="landing-page-subtitle">
        {subtitle}
      </Typography>
      <StyledDescription data-testid="landing-page-description">{description}</StyledDescription>
      {children}
    </PageWrapper>
  );
}

export default PanelListLandingPage;
