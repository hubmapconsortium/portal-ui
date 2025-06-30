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
      variant="outlined"
      iconMapping={{
        error: <ErrorRoundedIcon />,
        info: <InfoRoundedIcon />,
        success: <CheckCircleRoundedIcon />,
        warning: <WarningRoundedIcon />,
      }}
      {...props}
    />
  );
}

interface StyledAlertProps extends AlertProps {
  $marginBottom?: number;
  $marginTop?: number;
  $width?: string;
}

const StyledAlert = styled(OutlinedAlert, { shouldForwardProp: () => true })<StyledAlertProps>(
  ({ theme, $marginBottom, $marginTop, $width }) => ({
    '> &:not(svg)': {
      color: theme.palette.text.primary,
    },
    '& .MuiAlert-action': {
      padding: 0,
    },
    marginBottom: $marginBottom ?? 0,
    marginTop: $marginTop ?? 0,
    width: $width ?? 'auto',
  }),
) as React.ComponentType<StyledAlertProps>;

export { StyledAlert as Alert };
