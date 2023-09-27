import React, { forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useSnackbarStore } from './store';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function StyledSnackbar() {
  const { message, snackbarOpen, closeSnackbar } = useSnackbarStore((state) => ({
    message: state.message,
    snackbarOpen: state.snackbarOpen,
    closeSnackbar: state.closeSnackbar,
  }));

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    closeSnackbar();
  };

  if (!message) return null;

  const { severity, message: children, key } = message;

  return (
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose} key={key}>
      <Alert icon={false} onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {children}
      </Alert>
    </Snackbar>
  );
}
