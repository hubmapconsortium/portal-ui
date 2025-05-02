import React from 'react';
import { ButtonProps } from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Download from '@mui/icons-material/Download';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';

interface BulkDownloadButtonProps extends ButtonProps {
  tooltip: string;
  uuids: Set<string>;
  deselectRows?: (uuids: string[]) => void;
  trackingInfo?: EventInfo;
}
function BulkDownloadButton({
  tooltip,
  uuids,
  deselectRows,
  disabled,
  trackingInfo,
  ...rest
}: BulkDownloadButtonProps) {
  const { openDialog, isOpen } = useBulkDownloadDialog();

  return (
    <>
      <WhiteBackgroundIconTooltipButton
        tooltip={tooltip}
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
      </WhiteBackgroundIconTooltipButton>
      {isOpen && <BulkDownloadDialog deselectRows={deselectRows} />}
    </>
  );
}

export default BulkDownloadButton;
