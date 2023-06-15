import React, { useState, useEffect } from 'react';
import { List, ListItem, Typography } from '@material-ui/core';

import DialogModal from 'js/shared-styles/DialogModal/DialogModal';
import { DatasetIcon } from 'js/shared-styles/icons';

import { useCellTypeDatasets } from './hooks';
import { ViewDatasetsButton } from './style';

const CellTypeDatasetsModal = ({ cellType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const { datasets } = useCellTypeDatasets(cellType, hasBeenOpened);

  useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
    }
  }, [isOpen]);

  return (
    <>
      <ViewDatasetsButton onClick={() => setIsOpen(true)} startIcon={<DatasetIcon />} variant="outlined">
        View Datasets
      </ViewDatasetsButton>
      <DialogModal isOpen={isOpen} handleClose={() => setIsOpen(false)}>
        <Typography variant="h2" component="h2">
          Datasets with {cellType}
        </Typography>
        <List>
          {datasets?.map((dataset) => (
            <ListItem key={dataset}>{dataset}</ListItem>
          ))}
        </List>
      </DialogModal>
    </>
  );
};

export default CellTypeDatasetsModal;
