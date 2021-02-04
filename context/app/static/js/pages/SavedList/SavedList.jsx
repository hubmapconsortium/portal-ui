import React, { useState } from 'react';
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

function getListAndItsEntities(savedLists, listTitle) {
  const list = savedLists[listTitle];
  const listEntities = { ...list.Donor, ...list.Sample, ...list.Dataset };
  return [list, listEntities];
}

function SavedList({ listTitle }) {
  const decodedTitle = decodeURIComponent(listTitle);
  const [editedListTitle, setEditedListTitle] = useState(false);

  const currentTitle = editedListTitle || decodedTitle;

  const { savedLists, removeEntitiesFromList } = useSavedEntitiesStore(usedSavedEntitiesSelector);
  const [savedList, listEntitiesUuids] = getListAndItsEntities(savedLists, currentTitle);

  const entitiesLength = Object.keys(listEntitiesUuids).length;

  const listEntities = Object.entries(savedList).reduce((acc, [key, value]) => {
    if (['Donor', 'Sample', 'Dataset'].includes(key)) {
      return { ...acc, ...value };
    }
    return acc;
  }, {});

  const { description } = savedList;

  function deleteCallback(uuids) {
    removeEntitiesFromList(currentTitle, uuids);
  }

  return (
    <>
      <Typography variant="subtitle1" component="h1" color="primary">
        List
      </Typography>
      <Typography variant="h2">{currentTitle}</Typography>
      <RightAlignedButtonRow
        leftText={
          <Typography variant="body1" color="primary">
            {entitiesLength} {entitiesLength === 1 ? 'Item' : 'Items'}
          </Typography>
        }
        buttons={
          <>
            <EditListButton
              listDescription={description}
              listTitle={currentTitle}
              setEditedListTitle={setEditedListTitle}
            />
            <SavedListMenuButton listTitle={currentTitle} />
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
