import React, { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useSnackbarActions } from 'js/shared-styles/snackbars';

type fileType = 'Metadata' | 'Manifest';

const useBulkDownloadToasts = () => {
  const { toastError, toastSuccess } = useSnackbarActions();

  /** **********************************
   *           Error Toasts           *
   ********************************** */

  const toastErrorDownloadFile = useCallback(
    (type: fileType, retry: () => void) =>
      toastError(
        <Stack spacing={3} direction="row" alignItems="center">
          <Typography>{type} file failed to download.</Typography>
          <Button onClick={retry} variant="text" color="inherit" sx={{ alignSelf: 'flex-end' }}>
            Try Again
          </Button>
        </Stack>,
      ),
    [toastError],
  );

  /** *********************************
   *          Success Toasts         *
   ********************************* */

  const toastSuccessDownloadFile = useCallback(
    (type: fileType) => toastSuccess(`${type} file successfully downloaded.`),
    [toastSuccess],
  );

  return {
    toastErrorDownloadFile,
    toastSuccessDownloadFile,
  };
};

export default useBulkDownloadToasts;
