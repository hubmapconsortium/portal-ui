import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SavedListsDescription from 'js/components/savedLists/SavedListsDescription';
import { useAppContext } from 'js/components/Contexts';
import SavedListsContent from 'js/components/savedLists/SavedListsContent';

function SavedLists() {
  const { isHubmapUser } = useAppContext();

  return (
    <Stack spacing={1} marginBottom={10}>
      <Typography variant="h2" data-testid="my-lists-title">
        My Lists
      </Typography>
      <Stack spacing={3}>
        <SavedListsDescription />
        {isHubmapUser && <SavedListsContent />}
      </Stack>
    </Stack>
  );
}

export default SavedLists;
