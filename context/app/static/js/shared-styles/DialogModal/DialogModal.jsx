import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Alert } from 'js/shared-styles/alerts';
import { useSnackbarStore } from 'js/shared-styles/snackbars';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
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
  selectedRowsErrors,
  protectedRows,
  ...props
}) {
  const DialogContent = DialogContentComponent || MUIDialogContent;
  const { openSnackbar } = useSnackbarStore();
  const { deselectRow } = useSelectableTableStore();

  const removeProctedDatasets = () => {
    protectedRows.forEach((row) => {
      // eslint-disable-next-line no-underscore-dangle
      deselectRow(row._id);
    });

    openSnackbar('Protected datasets successfully removed from selection.');
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth {...props}>
      <StyledDialogTitle disableTypography>
        <Typography variant="h3" component="h2">
          {title}
        </Typography>
      </StyledDialogTitle>
      <DialogContent>
        {selectedRowsErrors?.length > 0 && (
          <Box sx={{ display: 'grid', gap: 1, marginBottom: 3 }}>
            {selectedRowsErrors.map((selectedRowsError) => {
              return (
                <div key={selectedRowsError.errorType}>
                  <Alert key={selectedRowsError} severity="error">
                    {selectedRowsError.message}
                  </Alert>
                  {selectedRowsError.type === 'protected' && (
                    <Box sx={{ marginTop: 1 }}>
                      <Button variant="contained" color="primary" onClick={() => removeProctedDatasets()}>
                        Remove Protected Datasets ({selectedRowsError.size})
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
