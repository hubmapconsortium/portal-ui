import { useCallback } from 'react';
import { useSnackbarActions } from 'js/shared-styles/snackbars';

type fileType = 'Metadata' | 'Manifest';

const useBulkDownloadToasts = () => {
  const { toastError, toastSuccess } = useSnackbarActions();

  /** **********************************
   *           Error Toasts           *
   ********************************** */

  const toastErrorDownloadFile = useCallback(
    (type: fileType) => toastError(`${type} file failed to download.`),
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
