import React from 'react';
import Button from '@mui/material/Button';

import DialogModal from 'js/shared-styles/DialogModal';
import DonorSampleConfigureSearchTable from 'js/components/entity-search/sidebar/DonorSampleConfigureSearchTable';
import DatasetConfigureSearchTable from 'js/components/entity-search/sidebar/DatasetConfigureSearchTable';
import { useSearchConfigStore } from 'js/components/entity-search/SearchWrapper/store';
import { useConfigureSearch } from './hooks';
import { StyledPaper, StyledDialogContent } from './style';

function getTableComponent(entityType) {
  switch (entityType) {
    case 'dataset':
      return DatasetConfigureSearchTable;
    default:
      return DonorSampleConfigureSearchTable;
  }
}

function ConfigureSearch() {
  const {
    dialogIsOpen,
    handleOpen,
    handleClose,
    handleSave,
    selectedFields,
    handleToggleField,
    selectedFacets,
    handleToggleFacet,
    resetSelections,
  } = useConfigureSearch();

  const { entityType } = useSearchConfigStore();

  const configureSearchTableProps = {
    selectedFields,
    selectedFacets,
    handleToggleField,
    handleToggleFacet,
  };

  const TableComponent = getTableComponent(entityType);

  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleOpen} fullWidth>
        Configure Search
      </Button>
      <DialogModal
        title="Configure Search"
        secondaryText="Add additional terms as a filter or as a column in the search results table."
        isOpen={dialogIsOpen}
        handleClose={handleClose}
        maxWidth="md"
        content={<TableComponent {...configureSearchTableProps} />}
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
        PaperComponent={StyledPaper}
        DialogContentComponent={StyledDialogContent}
        TransitionProps={{ onEnter: resetSelections }}
      />
    </>
  );
}

export default ConfigureSearch;
