import html2canvas from 'html2canvas';
import { useSnackbarActions } from 'js/shared-styles/snackbars';

import { RefObject, useCallback } from 'react';

export function useDownloadImage(ref: RefObject<HTMLElement>, chartName = 'chart') {
  const { toastError } = useSnackbarActions();
  const downloadImage = useCallback(() => {
    if (!ref.current) return;

    html2canvas(ref.current)
      .then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${chartName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error downloading image:', error);
        toastError('Failed to download image. Please try again.');
      });
  }, [ref, toastError, chartName]);

  return downloadImage;
}
