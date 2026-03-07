import React from 'react';
import Typography from '@mui/material/Typography';

import ErrorBody from 'js/components/error/ErrorBody';
import { Background, StyledPaper, StyledTypography } from './style';
import { getErrorTitleAndSubtitle } from './utils';

interface ErrorPageProps {
  errorCode?: number;
  urlPath?: string;
  isAuthenticated?: boolean;
  isGlobus401?: boolean;
  isMaintenancePage?: boolean;
  isErrorBoundary?: boolean;
  errorBoundaryMessage?: string;
}

function ErrorPage({
  errorCode,
  urlPath,
  isAuthenticated = false,
  isGlobus401 = false,
  isMaintenancePage = false,
  isErrorBoundary = false,
  errorBoundaryMessage,
}: ErrorPageProps) {
  const { title, subtitle } = getErrorTitleAndSubtitle(errorCode, isMaintenancePage, isErrorBoundary);

  return (
    <Background $isMaintenancePage={isMaintenancePage}>
      <StyledPaper>
        <StyledTypography variant="h1" $mb={2}>
          {title}
        </StyledTypography>
        <StyledTypography variant="subtitle1" color="primary" $mb={1}>
          {subtitle}
        </StyledTypography>
        {errorBoundaryMessage && (
          <StyledTypography variant="body1" $mb={1}>
            {errorBoundaryMessage}
          </StyledTypography>
        )}
        <Typography variant="body1">
          <ErrorBody
            errorCode={errorCode}
            urlPath={urlPath}
            isAuthenticated={isAuthenticated}
            isGlobus401={isGlobus401}
            isMaintenancePage={isMaintenancePage}
          />
        </Typography>
      </StyledPaper>
    </Background>
  );
}

export default ErrorPage;
