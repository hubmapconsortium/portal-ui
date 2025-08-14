import React from 'react';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { StyledMenuItem } from './style';
import { useFetchAndDownloadFile } from './hooks';

interface DownloadTSVItemProps {
  lcPluralType: string;
  analyticsCategory?: string;
}

export function DownloadTSVItem({ lcPluralType, analyticsCategory }: DownloadTSVItemProps) {
  const { toastError } = useSnackbarActions();
  const { trigger, isMutating } = useFetchAndDownloadFile({
    lcPluralType,
    analyticsCategory,
  });

  const handleClick: React.MouseEventHandler<HTMLElement> = () => {
    trigger().catch((e) => {
      toastError('Download failed.');
      console.error('Download failed', e);
    });
  };

  return (
    <StyledMenuItem
      onClick={handleClick}
      isLoading={isMutating}
      tooltip={`Download a TSV file of your selection. If no selection exists, all ${lcPluralType} will be downloaded.`}
    >
      Download
    </StyledMenuItem>
  );
}
