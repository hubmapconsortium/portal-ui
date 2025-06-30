import React from 'react';
import { ButtonProps } from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Download from '@mui/icons-material/Download';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';

interface BulkDownloadButtonProps extends ButtonProps {
  tooltip: string;
  uuids: Set<string>;
  trackingInfo?: EventInfo;
}
function BulkDownloadButton({ uuids, disabled, trackingInfo, ...rest }: BulkDownloadButtonProps) {
  const { openDialog, isOpen } = useBulkDownloadDialog();

  return (
    <>
      <DownloadButton
        onClick={() => {
          if (trackingInfo) {
            trackEvent(trackingInfo);
          }
          openDialog(uuids);
        }}
        disabled={disabled}
        {...rest}
      >
        <SvgIcon color={disabled ? 'disabled' : 'primary'} component={Download} />
      </DownloadButton>
      {isOpen && <BulkDownloadDialog />}
    </>
  );
}

export default BulkDownloadButton;
