import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import DialogModal from 'js/shared-styles/DialogModal';
import ConfigureSearchTable from 'js/components/entity-search/sidebar/ConfigureSearchTable';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { useSelectedFields } from './hooks';

import { Flex } from './style';

function ConfigureSearch() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const { selectedFields, handleToggleCheckbox } = useSelectedFields();
  const { setFields } = useStore();

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setDialogIsOpen(true)} fullWidth>
        Configure Search
      </Button>
      <DialogModal
        title="Configure Search"
        secondaryText="Add additional terms as a filter or as a column in the search results table."
        isOpen={dialogIsOpen}
        handleClose={() => setDialogIsOpen(false)}
        maxWidth="md"
        content={
          <Flex>
            <ConfigureSearchTable selectedFields={selectedFields} handleToggleCheckbox={handleToggleCheckbox} />
          </Flex>
        }
        actions={
          <>
            <Button onClick={() => setDialogIsOpen(false)}>Cancel</Button>
            <Button onClick={() => setFields(selectedFields)}>Save</Button>
          </>
        }
      />
    </>
  );
}

export default ConfigureSearch;
