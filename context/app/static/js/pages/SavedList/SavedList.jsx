import React from 'react';
import Typography from '@material-ui/core/Typography';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import DetailDescription from 'js/components/Detail/DetailDescription';
import SavedListMenuButton from 'js/components/savedLists/SavedListMenuButton';
import EditListButton from 'js/components/savedLists/EditListButton';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { StyledButtonRow, BottomAlignedTypography, SpacingDiv, PageSpacing } from './style';

const usedSavedEntitiesSelector = (state) => ({
  savedLists: state.savedLists,
  removeEntitiesFromList: state.removeEntitiesFromList,
});

function SavedList({ listUuid }) {
  const { savedLists, removeEntitiesFromList } = useSavedEntitiesStore(usedSavedEntitiesSelector);
  const savedList = savedLists[listUuid];

  const { savedEntities: listEntities } = savedList;

  const entitiesLength = Object.keys(listEntities).length;

  const { title, description } = savedList;

  function deleteCallback(uuids) {
    removeEntitiesFromList(listUuid, uuids);
  }

  return (
    <PageSpacing>
      <Typography variant="subtitle1" component="h1" color="primary">
        List
      </Typography>
      <Typography variant="h2">{title}</Typography>
      <StyledButtonRow
        leftText={
          <BottomAlignedTypography variant="body1" color="primary">
            {entitiesLength} {entitiesLength === 1 ? 'Item' : 'Items'}
          </BottomAlignedTypography>
        }
        buttons={
          <>
            <EditListButton listDescription={description} listTitle={title} listUuid={listUuid} />
            <SavedListMenuButton listUuid={listUuid} />
          </>
        }
      />
      <SpacingDiv>
        <LocalStorageDescription />
      </SpacingDiv>
      <SpacingDiv>
        <DetailDescription
          description={savedList.description}
          createdTimestamp={savedList.dateSaved}
          modifiedTimestamp={savedList.dateLastModified}
        />
      </SpacingDiv>
      <Typography variant="h3" component="h2">
        Items
      </Typography>
      <SavedEntitiesTable savedEntities={listEntities} deleteCallback={deleteCallback} isSavedListPage />
    </PageSpacing>
  );
}

export default SavedList;
