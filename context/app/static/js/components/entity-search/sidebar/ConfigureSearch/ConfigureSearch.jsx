import React from 'react';
import Button from '@material-ui/core/Button';

import DialogModal from 'js/shared-styles/DialogModal';
import DonorSampleConfigureSearchTable from 'js/components/entity-search/sidebar/DonorSampleConfigureSearchTable';
import DatasetConfigureSearchTable from 'js/components/entity-search/sidebar/DatasetConfigureSearchTable';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { useConfigureSearch } from './hooks';
import { StyledPaper } from './style';

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
  } = useConfigureSearch();

  const { entityType } = useStore();

  const configureSearchTableProps = {
    selectedFields,
    selectedFacets,
    handleToggleField,
    handleToggleFacet,
  };

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
        content={
          entityType === 'dataset' ? (
            <DatasetConfigureSearchTable {...configureSearchTableProps} />
          ) : (
            <DonorSampleConfigureSearchTable {...configureSearchTableProps} />
          )
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
        PaperComponent={StyledPaper}
      />
    </>
  );
}

export default ConfigureSearch;
