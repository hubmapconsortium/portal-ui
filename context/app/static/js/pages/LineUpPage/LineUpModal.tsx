import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import DialogModal from 'js/shared-styles/dialogs/DialogModal';
import { useLineUpModalStore } from 'js/stores/useLineUpModalStore';
import LineUpComponent from './LineUpComponent';

function LineUpModal() {
  const { isOpen, uuids, entityType, close } = useLineUpModalStore();

  return (
    <DialogModal
      title="Lineup Visualization"
      isOpen={isOpen}
      handleClose={close}
      maxWidth="xl"
      fullWidth
      withCloseButton
      content={
        <Box sx={{ height: '70vh', minHeight: '500px' }}>
          <LineUpComponent uuids={uuids} entityType={entityType} />
        </Box>
      }
      actions={
        <Button onClick={close} variant="contained">
          Close
        </Button>
      }
    />
  );
}

export default LineUpModal;
