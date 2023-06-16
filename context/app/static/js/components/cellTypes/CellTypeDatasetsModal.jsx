import React, { useState, useEffect } from 'react';

import DialogModal from 'js/shared-styles/DialogModal/DialogModal';
import { DatasetIcon } from 'js/shared-styles/icons';

import Skeleton from '@material-ui/lab/Skeleton/Skeleton';
import { useCellTypeDatasets } from './hooks';
import { ViewDatasetsButton } from './style';
import PanelList from '../../shared-styles/panels/PanelList/PanelList';

const CellTypeDatasetsModal = ({ cellType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const { datasets, isLoading } = useCellTypeDatasets(cellType, hasBeenOpened);

  useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
    }
  }, [isOpen]);

  return (
    <>
      <ViewDatasetsButton onClick={() => setIsOpen(true)} startIcon={<DatasetIcon />} variant="outlined">
        View&nbsp;Datasets
      </ViewDatasetsButton>
      <DialogModal
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        title={`Datasets with ${cellType}`}
        content={
          <>
            {isLoading && <Skeleton variant="text" width="100%" />}
            {datasets && (
              <PanelList
                panelsProps={datasets?.map((dataset) => ({ title: dataset, href: `/browse/dataset/${dataset}` }))}
              />
            )}
          </>
        }
      />
    </>
  );
};

export default CellTypeDatasetsModal;
