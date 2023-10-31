import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import MUIDialogContent, { DialogContentProps } from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';

import { Alert } from 'js/shared-styles/alerts';
import { IconButton } from '@mui/material';
import Stack from '@mui/system/Stack';
import { StyledDivider, StyledDialogTitle } from './style';
import { CloseIcon } from '../icons';

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
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexGrow={1}>
        <StyledDialogTitle variant="h3" component="h2">
          {title}
        </StyledDialogTitle>

        {withCloseButton && (
          <IconButton onClick={handleClose} color="primary">
            <CloseIcon sx={{ width: '36px', height: '36px' }} />
          </IconButton>
        )}
      </Stack>
      <DialogContent>
        {errorMessages.length > 0 && (
          <Box sx={{ display: 'grid', gap: 1, marginBottom: 3 }}>
            {errorMessages.map((errorMessage) => {
              return (
                <div key={errorMessage}>
                  <Alert key={errorMessage} severity="error">
                    {errorMessage}
                  </Alert>
                </div>
              );
            })}
          </Box>
        )}
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
