import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import PageTitle from 'js/shared-styles/pages/PageTitle';
import { PageWrapper, StyledDescription } from './style';

interface PanelListLandingPageProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  description: React.ReactNode;
  sectionTitle?: string;
  sectionDescription?: React.ReactNode;
  noIcon?: boolean;
}

function PanelListLandingPage({
  title,
  subtitle,
  description,
  sectionTitle,
  sectionDescription,
  children,
  noIcon,
  ...rest
}: PanelListLandingPageProps) {
  return (
    <PageWrapper>
      <PageTitle {...rest}>{title}</PageTitle>
      <Typography variant="subtitle1" color="primary" data-testid="landing-page-subtitle">
        {subtitle}
      </Typography>
      <StyledDescription noIcon={noIcon} data-testid="landing-page-description">
        {description}
      </StyledDescription>
      {sectionTitle && sectionDescription && (
        <Stack spacing={2} marginBottom={2}>
          <Typography variant="h4" component="h2">
            {sectionTitle}
          </Typography>
          <StyledDescription>{sectionDescription}</StyledDescription>
        </Stack>
      )}
      {children}
    </PageWrapper>
  );
}

export default PanelListLandingPage;
