import React, { PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button, { ButtonProps } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';

interface ConfirmationDialogProps extends PropsWithChildren {
  handleClose: () => void;
  handleConfirmAndClose: () => void;
  title: string;
  buttonTitle: string;
  buttonProps?: ButtonProps;
}
export default function ConfirmationDialog({
  handleClose,
  handleConfirmAndClose,
  title,
  buttonTitle = 'Confirm',
  buttonProps,
  children,
}: ConfirmationDialogProps) {
  return (
    <Dialog open onClose={handleClose} scroll="paper" aria-labelledby={`${title}-dialog`} maxWidth="lg">
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
        <Button onClick={handleConfirmAndClose} variant="contained" color="warning" {...buttonProps}>
          {buttonTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
