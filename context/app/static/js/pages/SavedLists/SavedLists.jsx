import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import CreateListDialog from 'js/components/savedLists/CreateListDialog';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { LightBlueLink } from 'js/shared-styles/Links';
import { Panel, PanelScrollBox } from 'js/shared-styles/panels';
import useSavedListsStore from 'js/stores/useSavedListsStore';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import Description from 'js/shared-styles/sections/Description';

import { SeparatedFlexRow, FlexBottom } from './style';

const useSavedListsSelector = (state) => ({
  savedLists: state.savedLists,
});

const usedSavedEntitiesSelector = (state) => state.savedEntities;

function SavedLists() {
  const { savedLists } = useSavedListsStore(useSavedListsSelector);
  const savedEntities = useSavedEntitiesStore(usedSavedEntitiesSelector);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Typography variant="h2" component="h1">
        My Lists
      </Typography>
      <Description padding="20px 20px">
        Your lists are currently stored on local storage and are not transferable between devices.{' '}
      </Description>
      <Typography variant="h3" component="h2">
        My Saves Lists
      </Typography>
      {Object.keys(savedEntities).length === 0 ? (
        <Description padding="20px 20px">
          No items saved. Navigate to <LightBlueLink href="/search?entity_type[0]=Donor">donors</LightBlueLink>,{' '}
          <LightBlueLink href="/search?entity_type[0]=Sample">samples</LightBlueLink> or{' '}
          <LightBlueLink href="/search?entity_type[0]=Dataset">datasets</LightBlueLink> search pages to explore data to
          save.
        </Description>
      ) : (
        <SavedEntitiesTable />
      )}
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
        <Description padding="20px 20px">No lists created yet.</Description>
      ) : (
        <PanelScrollBox>
          {Object.entries(savedLists).map(([key, value]) => {
            const { donors, samples, datasets } = value;
            return (
              <Panel
                title={key}
                href=""
                secondaryText={value.description}
                entityCounts={{ donors: donors.length, samples: samples.length, datasets: datasets.length }}
              />
            );
          })}
        </PanelScrollBox>
      )}
    </>
  );
}

export default SavedLists;
