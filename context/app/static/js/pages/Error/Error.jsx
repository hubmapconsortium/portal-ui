import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

import ErrorBody from 'js/components/error/ErrorBody';
import { Background, StyledPaper, StyledTypography } from './style';
import { getErrorTitleAndSubtitle } from './utils';

function Error({
  errorCode,
  urlPath,
  isAuthenticated,
  isGlobus401,
  isMaintenancePage,
  isErrorBoundary,
  errorBoundaryMessage,
}) {
  const { title, subtitle } = getErrorTitleAndSubtitle(errorCode, isMaintenancePage, isErrorBoundary);

  return (
    <Background isMaintenancePage={isMaintenancePage}>
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
            isErrorBoundary={isErrorBoundary}
          />
        </Typography>
      </StyledPaper>
    </Background>
  );
}

Error.propTypes = {
  errorCode: PropTypes.number,
  urlPath: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  isGlobus401: PropTypes.bool,
  isMaintenancePage: PropTypes.bool,
  isErrorBoundary: PropTypes.bool,
  errorBoundaryMessage: PropTypes.string,
};

Error.defaultProps = {
  errorCode: undefined,
  urlPath: undefined,
  isAuthenticated: false,
  isGlobus401: false,
  isMaintenancePage: false,
  isErrorBoundary: false,
  errorBoundaryMessage: undefined,
};

export default Error;
