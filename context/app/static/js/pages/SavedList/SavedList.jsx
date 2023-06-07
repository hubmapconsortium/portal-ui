import React, { useCallback } from 'react';
import Typography from '@mui/material/Typography';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import SummaryBody from 'js/components/detailPage/summary/SummaryBody';
import SavedListMenuButton from 'js/components/savedLists/SavedListMenuButton';
import EditListButton from 'js/components/savedLists/EditListButton';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { SpacedSectionButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/SectionButtonRow';
import { SpacingDiv, PageSpacing, StyledHeader } from './style';

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

  const deleteCallback = useCallback(
    function deleteCallback(uuids) {
      removeEntitiesFromList(listUUID, uuids);
    },
    [listUUID, removeEntitiesFromList],
  );

  return (
    <PageSpacing>
      <Typography variant="subtitle1" component="h1" color="primary">
        List
      </Typography>
      <Typography variant="h2">{title}</Typography>
      <SpacedSectionButtonRow
        leftText={
          <BottomAlignedTypography variant="body1" color="primary">
            {entitiesLength} {entitiesLength === 1 ? 'Item' : 'Items'}
          </BottomAlignedTypography>
        }
        buttons={
          <>
            <EditListButton listDescription={description} listTitle={title} listUUID={listUUID} />
            <SavedListMenuButton listUUID={listUUID} />
          </>
        }
      />
      <SpacingDiv>
        <LocalStorageDescription />
      </SpacingDiv>
      <SpacingDiv>
        <SummaryBody
          description={savedList.description}
          created_timestamp={savedList.dateSaved}
          last_modified_timestamp={savedList.dateLastModified}
        />
      </SpacingDiv>
      <StyledHeader variant="h3" component="h2">
        Items
      </StyledHeader>
      <SavedEntitiesTable savedEntities={listEntities} deleteCallback={deleteCallback} isSavedListPage />
    </PageSpacing>
  );
}

export default SavedList;
