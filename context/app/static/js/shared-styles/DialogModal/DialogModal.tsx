import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import MUIDialogContent, { DialogContentProps } from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/system/Stack';

import { StyledDivider, StyledDialogTitle } from './style';
import { CloseIcon } from '../icons';
import ErrorOrWarningMessages from '../alerts/ErrorOrWarningMessages';

interface DialogModalProps extends Omit<React.ComponentProps<typeof Dialog>, 'content' | 'open'> {
  title: string;
  errorMessages?: string[];
  warning?: React.ReactNode;
  secondaryText?: React.ReactNode;
  actions?: React.ReactNode;
  isOpen: boolean;
  content?: React.ReactNode;
  handleClose: () => void;
  DialogContentComponent?: React.ComponentType<DialogContentProps>;
  withCloseButton?: boolean;
}

function DialogModal({
  title,
  warning,
  secondaryText,
  content,
  actions,
  isOpen,
  handleClose,
  DialogContentComponent,
  errorMessages = [],
  withCloseButton,
  ...props
}: DialogModalProps) {
  const DialogContent = DialogContentComponent ?? MUIDialogContent;

  return (
    <Dialog {...props} open={isOpen} onClose={handleClose} fullWidth>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexGrow={1} pt={2} pl={3} pr={2}>
        <StyledDialogTitle variant="h3" component="h2">
          {title}
        </StyledDialogTitle>

        {withCloseButton && (
          <IconButton onClick={handleClose} color="primary" title="Close dialog">
            <CloseIcon sx={{ width: '36px', height: '36px' }} />
          </IconButton>
        )}
      </Stack>
      <DialogContent>
        <ErrorOrWarningMessages errorMessages={errorMessages} />
        {secondaryText && (
          <DialogContentText color="primary" variant="subtitle2">
            {secondaryText}
          </DialogContentText>
        )}
        {warning && (
          <DialogContentText color="error" variant="body2">
            {warning}
          </DialogContentText>
        )}
        {content}
      </DialogContent>
      <StyledDivider />
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
}

export default DialogModal;
