import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';

import { StyledDivider, StyledDialogTitle } from './style';

function DialogModal({
  title,
  warning,
  secondaryText,
  content,
  actions,
  isOpen,
  handleClose,
  DialogContentComponent,
  ...props
}) {
  const DialogContent = DialogContentComponent || MUIDialogContent;

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth {...props}>
      <StyledDialogTitle disableTypography>
        <Typography variant="h3" component="h2">
          {title}
        </Typography>
      </StyledDialogTitle>
      <DialogContent>
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
