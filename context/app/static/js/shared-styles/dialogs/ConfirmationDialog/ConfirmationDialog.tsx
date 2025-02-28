import React, { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';

interface ConfirmDeclineInvitationDialogProps extends PropsWithChildren {
  handleClose: () => void;
  handleConfirmAndClose: () => void;
  title: string;
  buttonTitle: string;
}
export default function ConfirmDeclineInvitationDialog({
  handleClose,
  handleConfirmAndClose,
  title,
  buttonTitle = 'Confirm',
  children,
}: ConfirmDeclineInvitationDialogProps) {
  return (
    <Dialog open onClose={handleClose} scroll="paper" aria-labelledby={`${title}-dialog`} maxWidth="md">
      <Stack display="flex" flexDirection="row" justifyContent="space-between" marginRight={1}>
        <DialogTitle id={`${title}-title`} variant="h3">
          {title}
        </DialogTitle>
        <Box alignContent="center">
          <IconButton aria-label="Close" onClick={handleClose} size="large">
            <CloseRounded />
          </IconButton>
        </Box>
      </Stack>
      <DialogContent>{children}</DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirmAndClose} variant="contained" color="warning">
          {buttonTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
