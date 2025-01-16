import React from 'react';
import { format } from 'date-fns/format';
import Typography from '@mui/material/Typography';

import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import { SummaryBodyContent } from 'js/components/detailPage/summary/SummaryBody';
import SavedListMenuButton from 'js/components/savedLists/SavedListMenuButton';
import EditListButton from 'js/components/savedLists/EditListButton';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { SpacedSectionButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/SectionButtonRow';
import { useSavedLists } from 'js/components/savedLists/hooks';
import { SpacingDiv, PageSpacing, StyledHeader } from './style';

function SavedList({ listUUID }: { listUUID: string }) {
  const { savedLists, removeEntitiesFromList } = useSavedLists();
  const savedList = savedLists[listUUID];

  if (!savedList) {
    throw new Error('This list does not exist.');
  }

  const { savedEntities: listEntities } = savedList;

  const entitiesLength = Object.keys(listEntities).length;

  const { title, description } = savedList;

  function deleteCallback(uuids: Set<string>) {
    removeEntitiesFromList(listUUID, [...uuids]);
  }

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
        <SummaryBodyContent
          description={savedList.description}
          creationDate={format(new Date(savedList.dateSaved), 'yyyy-MM-dd')}
          creationLabel="Date Saved"
        />
      </SpacingDiv>
      <StyledHeader variant="h3">Items</StyledHeader>
      <SavedEntitiesTable savedEntities={listEntities} deleteCallback={deleteCallback} isSavedListPage />
    </PageSpacing>
  );
}

export default SavedList;
