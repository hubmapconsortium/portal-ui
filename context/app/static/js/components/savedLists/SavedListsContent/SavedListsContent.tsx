import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {
  SavedListsSuccessAlert,
  SavedListsTransferAlert,
} from 'js/components/savedLists/SavedListsAlerts/SavedListsAlerts';
import SavedListScrollbox from 'js/components/savedLists/SavedListScrollbox';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import useSavedLists from 'js/components/savedLists/hooks';

function SavedListsContent() {
  const { savedEntities, savedLists, handleDeleteEntities } = useSavedLists();

  return (
    <Stack>
      <SavedListsTransferAlert />
      <SavedListsSuccessAlert fromSavedLists />
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h3">My Saved Items</Typography>
          <SavedEntitiesTable
            savedEntities={savedEntities.savedEntities}
            deleteCallback={(entities) => {
              handleDeleteEntities(entities).catch((error) => {
                console.error(error);
              });
            }}
          />
        </Stack>
        <SavedListScrollbox savedLists={savedLists} />
      </Stack>
    </Stack>
  );
}

export default SavedListsContent;
