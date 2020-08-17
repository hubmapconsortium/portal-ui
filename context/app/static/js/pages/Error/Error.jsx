import React from 'react';
import Typography from '@material-ui/core/Typography';

import ErrorBody from 'js/components/error/ErrorBody';
import { Background, StyledPaper, StyledTypography } from './style';

const errorTitle = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Access Denied',
  404: 'Page Not Found',
  504: 'Gateway Timeout',
  500: 'Internal Server Error',
};

function Error(props) {
  const { errorCode, isGlobus401, isMaintenancePage } = props;

  const title = isMaintenancePage ? 'Portal Maintenance' : errorTitle[errorCode];
  const subtitle = isMaintenancePage
    ? 'Portal unavailable for scheduled maintenance.'
    : `HTTP Error ${errorCode}: ${title}`;

  return (
    <Background>
      <StyledPaper>
        <StyledTypography variant="h1" $mb={2}>
          {title}{' '}
        </StyledTypography>
        <StyledTypography variant="subtitle1" color="primary" $mb={1}>
          {subtitle}
        </StyledTypography>
        <Typography variant="body1">
          <ErrorBody errorCode={errorCode} isGlobus401={isGlobus401} isMaintenancePage={isMaintenancePage} />
        </Typography>
      </StyledPaper>
    </Background>
  );
}

export default Error;
