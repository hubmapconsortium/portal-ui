import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { StyledDivider } from './style';

function DialogModal({ dialogTitle, dialogContent, dialogActions, isOpen, handleClose }) {
  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      <StyledDivider />
      <DialogActions>{dialogActions}</DialogActions>
    </Dialog>
  );
}

export default DialogModal;
