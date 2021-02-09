import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Description from 'js/shared-styles/sections/Description';
import CreateListDialog from 'js/components/savedLists/CreateListDialog';
import SavedListPanel from 'js/components/savedLists/SavedListPanel';
import { SeparatedFlexRow, FlexBottom, MaxHeightScrollbox } from './style';

function SavedListScrollbox({ savedLists }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <SeparatedFlexRow>
        <div>
          <Typography variant="h3" component="h2">
            All Created Lists
          </Typography>
          <Typography variant="subtitle1">{Object.keys(savedLists).length} Lists</Typography>
        </div>
        <FlexBottom>
          <Button variant="contained" color="primary" onClick={() => setDialogIsOpen(true)}>
            Create New List
          </Button>
          <CreateListDialog dialogIsOpen={dialogIsOpen} setDialogIsOpen={setDialogIsOpen} />
        </FlexBottom>
      </SeparatedFlexRow>
      {Object.keys(savedLists).length === 0 ? (
        <Description padding="20px">No lists created yet.</Description>
      ) : (
        <MaxHeightScrollbox>
          {Object.entries(savedLists).map(([key, value]) => {
            return <SavedListPanel key={key} entityObject={value} listUuid={key} />;
          })}
        </MaxHeightScrollbox>
      )}
    </>
  );
}

export default SavedListScrollbox;
