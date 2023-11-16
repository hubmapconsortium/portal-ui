import React from 'react';
import { StyledMenuItem } from './style';
import { useFetchAndDownloadFile } from './hooks';

interface DownloadTSVItemProps {
  lcPluralType: string;
  analyticsCategory?: string;
}

export function DownloadTSVItem({ lcPluralType, analyticsCategory }: DownloadTSVItemProps) {
  const { trigger, isMutating } = useFetchAndDownloadFile({
    lcPluralType,
    analyticsCategory,
  });

  const handleClick: React.MouseEventHandler<HTMLElement> = () => {
    trigger().catch(console.error);
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
