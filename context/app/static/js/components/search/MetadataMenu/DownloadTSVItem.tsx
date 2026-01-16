import React from 'react';
import { StyledMenuItem } from './style';
import { useSharedEntityLogic } from './useSharedEntityLogic';
import { useDownloadTSV } from 'js/hooks/useDownloadTSV';

interface DownloadTSVItemProps {
  lcPluralType: string;
  analyticsCategory?: string;
}

export function DownloadTSVItem({ lcPluralType, analyticsCategory }: DownloadTSVItemProps) {
  const queryParams = useSharedEntityLogic(lcPluralType);

  const { initiateDownload, isLoading } = useDownloadTSV({
    lcPluralType,
    queryParams,
    analyticsCategory: analyticsCategory || 'MetadataMenu',
  });

  return (
    <StyledMenuItem
      onClick={initiateDownload}
      isLoading={isLoading}
      tooltip={`Download a TSV file of your selection. If no selection exists, all ${lcPluralType} will be downloaded.`}
    >
      Download
    </StyledMenuItem>
  );
}
