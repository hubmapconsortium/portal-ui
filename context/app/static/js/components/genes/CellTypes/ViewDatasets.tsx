import React, { useState } from 'react';

import Button from '@mui/material/Button';

import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import DatasetsTable from './DatasetsTable';

interface Props {
  id: string;
  name: string;
}

export default function ViewDatasets({ id, name }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        startIcon={<entityIconMap.Dataset />}
        variant="outlined"
        sx={{ borderRadius: '4px' }}
        onClick={() => setOpen(true)}
      >
        View&nbsp;Datasets
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Datasets with {name}</DialogTitle>
        <DialogContent>
          <DatasetsTable id={id} />
        </DialogContent>
      </Dialog>
    </>
  );
}
