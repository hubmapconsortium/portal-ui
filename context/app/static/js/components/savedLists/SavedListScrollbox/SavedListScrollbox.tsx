import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import Description from 'js/shared-styles/sections/Description';
import CreateListDialog from 'js/components/savedLists/CreateListDialog';
import SavedListPanel from 'js/components/savedLists/SavedListPanel';
import { SavedEntitiesList } from 'js/components/savedLists/types';
import { SeparatedFlexRow, FlexBottom, MaxHeightScrollbox } from './style';

interface SavedListScrollboxProps {
  savedLists: Record<string, SavedEntitiesList>;
}

function SavedListScrollbox({ savedLists }: SavedListScrollboxProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const listCount = Object.keys(savedLists).length;

  return (
    <Stack>
      <SeparatedFlexRow>
        <div>
          <Typography variant="h3" component="h2" marginBottom={2}>
            All Created Lists
          </Typography>
          <Typography variant="subtitle1">
            {listCount} List{listCount > 1 && 's'}
          </Typography>
        </div>
        <FlexBottom>
          <Button variant="contained" color="primary" onClick={() => setDialogIsOpen(true)}>
            Create New List
          </Button>
          <CreateListDialog dialogIsOpen={dialogIsOpen} setDialogIsOpen={setDialogIsOpen} />
        </FlexBottom>
      </SeparatedFlexRow>
      {Object.keys(savedLists).length === 0 ? (
        <Description>No lists created yet.</Description>
      ) : (
        <MaxHeightScrollbox>
          {Object.entries(savedLists).map(([key, value]) => {
            return <SavedListPanel key={key} list={value} listUUID={key} />;
          })}
        </MaxHeightScrollbox>
      )}
    </Stack>
  );
}

export default SavedListScrollbox;
