import React from 'react';
import styled from 'styled-components';
import Alert from '@mui/material/Alert';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

function OutlinedAlert(props) {
  return (
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
}

const StyledAlert = styled(OutlinedAlert)`
  :not(svg) {
    color: ${(props) => props.theme.palette.text.primary};
  }
  margin-bottom: ${(props) => props.$marginBottom || 0}px;
`;

export { StyledAlert as Alert };
