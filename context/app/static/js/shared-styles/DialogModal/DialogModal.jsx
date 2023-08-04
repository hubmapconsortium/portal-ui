import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';

import { Alert } from 'js/shared-styles/alerts';
import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
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
  const { selectedRows } = useStore();

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth {...props}>
      <StyledDialogTitle disableTypography>
        <Typography variant="h3" component="h2">
          {title}

          <Alert severity="error">{`You have selected ${selectedRows.size} datasets. Workspaces currently only supports up to 10 datasets. Please unselect datasets.`}</Alert>
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
