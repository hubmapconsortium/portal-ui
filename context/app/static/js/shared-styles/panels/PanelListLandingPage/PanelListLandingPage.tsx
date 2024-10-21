import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { PageWrapper, StyledDescription } from './style';

interface PanelListLandingPageProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  description: React.ReactNode;
  noIcon?: boolean;
}

function PanelListLandingPage({ title, subtitle, description, children, noIcon, ...rest }: PanelListLandingPageProps) {
  return (
    <PageWrapper {...rest}>
      <PageTitle>{title}</PageTitle>
      <Typography variant="subtitle1" color="primary" data-testid="landing-page-subtitle">
        {subtitle}
      </Typography>
      <StyledDescription noIcon={noIcon} data-testid="landing-page-description">
        {description}
      </StyledDescription>
      {children}
    </PageWrapper>
  );
}

export default PanelListLandingPage;
