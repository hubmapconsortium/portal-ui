import { useCallback } from 'react';

import { useSnackbarStore } from 'js/shared-styles/snackbars';

export const useHandleCopyClick = () => {
  const { toastSuccess, toastError } = useSnackbarStore();
  return useCallback(
    (value: string, additionalText?: string) => {
      setTimeout(() => {
        navigator.clipboard
          .writeText(value)
          .then(() => {
            toastSuccess(`Copied to clipboard.${additionalText ? ` ${additionalText}` : ''}`);
          })
          .catch((e) => {
            console.error('Error copying to clipboard', e);
            toastError(
              `Encountered an error while copying, please try again.${additionalText ? ` ${additionalText}` : ''}`,
            );
          });
      }, 0);
    },
    [toastError, toastSuccess],
  );
};
