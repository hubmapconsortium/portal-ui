import React from 'react';
import { styled } from '@mui/material/styles';
import Alert, { AlertProps } from '@mui/material/Alert';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

function OutlinedAlert(props: AlertProps) {
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

interface StyledAlertProps extends AlertProps {
  $marginBottom?: number;
}

const StyledAlert = styled(OutlinedAlert)<StyledAlertProps>(({ theme, $marginBottom }) => ({
  ':not(svg)': {
    color: theme.palette.text.primary,
  },
  marginBottom: $marginBottom ?? 0,
}));

export { StyledAlert as Alert };
