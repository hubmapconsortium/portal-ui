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
  $marginTop?: number;
}

// TODO: Figure out why `sx` doesn't work with this component. https://hms-dbmi.atlassian.net/browse/CAT-650
const StyledAlert = styled(OutlinedAlert)<StyledAlertProps>(({ theme, $marginBottom, $marginTop }) => ({
  ':not(svg)': {
    color: theme.palette.text.primary,
  },
  '& .MuiAlert-action': {
    padding: 0,
  },
  marginBottom: $marginBottom ?? 0,
  marginTop: $marginTop ?? 0,
}));

export { StyledAlert as Alert };
