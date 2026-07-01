import React from 'react';
import { ButtonProps } from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Download from '@mui/icons-material/Download';
import { useBulkDownloadStore } from 'js/stores/useBulkDownloadStore';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';
import DownloadButton from 'js/shared-styles/buttons/DownloadButton';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';

interface BulkDownloadButtonProps extends ButtonProps {
  tooltip: string;
  uuids: Set<string>;
  deselectRows?: (uuids: string[]) => void;
  trackingInfo?: EventInfo;
}
function BulkDownloadButton({ uuids, deselectRows, disabled, trackingInfo, ...rest }: BulkDownloadButtonProps) {
  const { openDialog, isOpen } = useBulkDownloadStore();

  return (
    <>
      <DownloadButton
        aria-label="Bulk Download selected datasets"
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
      {isOpen && <BulkDownloadDialog deselectRows={deselectRows} />}
    </>
  );
}

export default BulkDownloadButton;
