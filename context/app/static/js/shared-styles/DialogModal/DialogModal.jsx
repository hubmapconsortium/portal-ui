import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Typography from '@material-ui/core/Typography';

import { StyledDivider } from './style';

function DialogModal({ title, warning, content, actions, isOpen, handleClose, ...props }) {
  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth {...props}>
      <DialogTitle disableTypography>
        <Typography variant="h3" component="h2">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
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
