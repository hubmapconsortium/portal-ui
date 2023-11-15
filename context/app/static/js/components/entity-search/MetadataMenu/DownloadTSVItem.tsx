import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { StyledInfoIcon } from './style';
import { useFetchAndDownloadFile } from './hooks';

interface DownloadTSVItemProps {
  lcPluralType: string;
  analyticsCategory: string;
}

export function DownloadTSVItem({ lcPluralType, analyticsCategory }: DownloadTSVItemProps) {
  const { trigger, isMutating } = useFetchAndDownloadFile({
    lcPluralType,
    analyticsCategory,
  });

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    trigger().catch(console.error);
  };

  return (
    <MenuItem onClick={handleClick} component="button" sx={{ width: '100%' }}>
      <Stack direction="column" width="100%">
        <Stack direction="row" alignItems="center">
          <span>Download</span>
          <SecondaryBackgroundTooltip title="Download a TSV of the table metadata." placement="bottom-start">
            <StyledInfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        </Stack>
        {isMutating && <LinearProgress />}
      </Stack>
    </MenuItem>
  );
}
