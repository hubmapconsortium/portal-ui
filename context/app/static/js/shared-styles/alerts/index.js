import React from 'react';
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

export { OutlinedAlert as Alert };
