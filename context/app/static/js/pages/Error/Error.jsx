import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import ErrorBody from 'js/components/error/ErrorBody';
import { Background, StyledPaper, StyledTypography } from './style';
import { getErrorTitleAndSubtitle } from './utils';

function Error(props) {
  const { errorCode, isGlobus401, isMaintenancePage } = props;

  const { title, subtitle } = getErrorTitleAndSubtitle(errorCode, isMaintenancePage);

  return (
    <Background>
      <StyledPaper>
        <StyledTypography variant="h1" $mb={2}>
          {title}
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

Error.propTypes = {
  errorCode: PropTypes.number,
  isGlobus401: PropTypes.bool,
  isMaintenancePage: PropTypes.bool,
};

Error.defaultProps = {
  errorCode: undefined,
  isGlobus401: false,
  isMaintenancePage: false,
};

export default Error;
