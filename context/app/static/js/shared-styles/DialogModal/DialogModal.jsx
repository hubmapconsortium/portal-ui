import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Alert } from 'js/shared-styles/alerts';
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
  selectedRowsError,
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
        {selectedRowsError?.length > 0 && (
          <Box sx={{ display: 'grid', gap: 1, marginBottom: 3 }}>
            {selectedRowsError.map((errorMessage) => {
              return (
                <div key={errorMessage.errorType}>
                  <Alert key={errorMessage} severity="error">
                    {errorMessage.message}
                  </Alert>
                  {errorMessage.type === 'protected' && (
                    <Box sx={{ marginTop: 1 }}>
                      <Button variant="contained" color="primary" onClick={() => alert('button clicked')}>
                        Create New List
                      </Button>
                    </Box>
                  )}
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
