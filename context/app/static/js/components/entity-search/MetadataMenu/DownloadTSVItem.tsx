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
    <StyledMenuItem onClick={handleClick} isLoading={isMutating} tooltip="Download a TSV of the table metadata.">
      Download
    </StyledMenuItem>
  );
}
