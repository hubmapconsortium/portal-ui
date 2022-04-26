import React from 'react';
import Button from '@material-ui/core/Button';

import DialogModal from 'js/shared-styles/DialogModal';
import ConfigureSearchTable from 'js/components/entity-search/sidebar/ConfigureSearchTable';
import { useConfigureSearch } from './hooks';

import { Flex } from './style';

function ConfigureSearch() {
  const { dialogIsOpen, handleOpen, handleClose, handleSave, selectedFields, handleToggleField } = useConfigureSearch();

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
          <Flex>
            <ConfigureSearchTable selectedFields={selectedFields} handleToggleField={handleToggleField} />
          </Flex>
        }
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        }
      />
    </>
  );
}

export default ConfigureSearch;
