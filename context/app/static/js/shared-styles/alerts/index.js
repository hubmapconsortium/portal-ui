import React from 'react';
import styled from 'styled-components';
import Alert from '@material-ui/lab/Alert';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

const OutlinedAlert = (props) => (
  <Alert
    {...props}
    variant="outlined"
    iconMapping={{
      error: <ErrorRoundedIcon />,
      info: <InfoRoundedIcon />,
      success: <CheckCircleRoundedIcon />,
      warning: <WarningRoundedIcon />,
    }}
  />
);

const StyledAlert = styled(OutlinedAlert)`
  :not(svg) {
    color: ${(props) => props.theme.palette.text.primary};
  }
  margin-bottom: ${(props) => props.$marginBotton || 0}px;
`;

const DetailPageAlert = styled(StyledAlert)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
  // Need to put this above the section container on the z-index stack due to the padding/margin offset fix for the anchor links.
  position: relative;
  z-index: ${(props) => props.theme.zIndex.interactiveContentAboveDetailSection};
`;

export { StyledAlert as Alert, DetailPageAlert };
