import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import CreateListDialog from 'js/components/savedLists/CreateListDialog';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { LightBlueLink } from 'js/shared-styles/Links';
import { Panel, PanelScrollBox } from 'js/shared-styles/panels';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import Description from 'js/shared-styles/sections/Description';
import { SeparatedFlexRow, FlexBottom, StyledAlert } from './style';

const usedSavedEntitiesSelector = (state) => ({
  savedLists: state.savedLists,
  savedEntities: state.savedEntities,
  listsToBeDeleted: state.listsToBeDeleted,
  deleteLists: state.deleteLists,
});

function SavedLists() {
  const { savedLists, savedEntities, listsToBeDeleted, deleteLists } = useSavedEntitiesStore(usedSavedEntitiesSelector);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [shouldDisplayDeleteAlert, setShouldDisplayDeleteAlert] = useState(false);

  useEffect(() => {
    if (listsToBeDeleted.length > 0) {
      deleteLists();
      setShouldDisplayDeleteAlert(true);
    }
  }, [listsToBeDeleted, deleteLists]);

  return (
    <>
      {shouldDisplayDeleteAlert && (
        <StyledAlert severity="success" onClose={() => setShouldDisplayDeleteAlert(false)}>
          List successfully deleted.
        </StyledAlert>
      )}
      <Typography variant="h2" component="h1">
        My Lists
      </Typography>
      <LocalStorageDescription />
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
            const { Donor, Sample, Dataset } = value;
            return (
              <Panel
                key={key}
                title={key}
                href={`/my-lists/${encodeURIComponent(key)}`}
                secondaryText={value.description}
                entityCounts={{
                  donors: Object.keys(Donor).length,
                  samples: Object.keys(Sample).length,
                  datasets: Object.keys(Dataset).length,
                }}
              />
            );
          })}
        </PanelScrollBox>
      )}
    </>
  );
}

export default SavedLists;
