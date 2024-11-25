import React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { useBulkDownloadDialog } from 'js/components/bulkDownload/hooks';
import BulkDownloadDialog from 'js/components/bulkDownload/BulkDownloadDialog';
import OutlinedButton from 'js/shared-styles/buttons/OutlinedButton';
import { Box } from '@mui/material';

interface BulkDownloadTextButtonProps extends ButtonProps {
  uuids: Set<string>;
}
function BulkDownloadTextButton({ uuids, ...rest }: BulkDownloadTextButtonProps) {
  const { openDialog, isOpen } = useBulkDownloadDialog();

  return (
    <Box>
      <OutlinedButton color="primary" onClick={() => openDialog(uuids)} {...rest}>
        Download Files with HuBMAP CLT
      </OutlinedButton>
      {isOpen && <BulkDownloadDialog />}
    </Box>
  );
}

export default BulkDownloadTextButton;
