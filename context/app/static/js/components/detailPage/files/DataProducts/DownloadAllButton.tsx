import React, { useCallback } from 'react';

import Button from '@mui/material/Button';
import { useFilesContext } from '../FilesContext';
import { DownloadIcon } from '../../MetadataTable/style';

type DownloadAllButtonProps = {
  onDownloadAll: () => void;
  disabled?: boolean;
};

export function DownloadAllButton({ onDownloadAll, disabled }: DownloadAllButtonProps) {
  const { hasAgreedToDUA, openDUA } = useFilesContext();

  // On click of download all button,
  // - mount MultiFileDownloader component with download iframes
  // - disable download all button
  // - after 1 second, unmount MultiFileDownloader component and enable download all button
  const onClick = useCallback(() => {
    if (!hasAgreedToDUA) {
      openDUA({ handleAgree: onDownloadAll });
    } else {
      onDownloadAll();
    }
  }, [hasAgreedToDUA, onDownloadAll, openDUA]);

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<DownloadIcon />}
      sx={{ borderRadius: '4px' }}
      onClick={onClick}
      disabled={disabled}
    >
      Download All
    </Button>
  );
}
