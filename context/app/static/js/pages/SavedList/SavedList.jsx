import React from 'react';
import Typography from '@material-ui/core/Typography';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import DetailDescription from 'js/components/Detail/DetailDescription';
import RightAlignedButtonRow from 'js/shared-styles/sections/RightAlignedButtonRow';
import SavedListMenuButton from 'js/components/savedLists/SavedListMenuButton';
import EditListButton from 'js/components/savedLists/EditListButton';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';

const usedSavedEntitiesSelector = (state) => ({
  savedLists: state.savedLists,
  removeEntitiesFromList: state.removeEntitiesFromList,
});

function SavedList({ listUUID }) {
  const { savedLists, removeEntitiesFromList } = useSavedEntitiesStore(usedSavedEntitiesSelector);
  const savedList = savedLists[listUUID];

  const { savedEntities: listEntities } = savedList;

  const entitiesLength = Object.keys(listEntities).length;

  const { title, description } = savedList;

  function deleteCallback(uuids) {
    removeEntitiesFromList(listUUID, uuids);
  }

  return (
    <>
      <Typography variant="subtitle1" component="h1" color="primary">
        List
      </Typography>
      <Typography variant="h2">{title}</Typography>
      <RightAlignedButtonRow
        leftText={
          <Typography variant="body1" color="primary">
            {entitiesLength} {entitiesLength === 1 ? 'Item' : 'Items'}
          </Typography>
        }
        buttons={
          <>
            <EditListButton listDescription={description} listTitle={title} listUUID={listUUID} />
            <SavedListMenuButton listUUID={listUUID} />
          </>
        }
      />
      <LocalStorageDescription />
      <DetailDescription
        description={savedList.description}
        createdTimestamp={savedList.dateSaved}
        modifiedTimestamp={savedList.dateLastModified}
      />
      <Typography variant="h3" component="h2">
        Items
      </Typography>
      <SavedEntitiesTable savedEntities={listEntities} deleteCallback={deleteCallback} isSavedListPage />
    </>
  );
}

export default SavedList;
