import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import { SummaryBodyContent } from 'js/components/detailPage/summary/SummaryBody';
import SavedListMenuButton from 'js/components/savedLists/SavedListMenuButton';
import EditListButton from 'js/components/savedLists/EditListButton';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { SpacedSectionButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/SectionButtonRow';
import { useSavedLists } from 'js/components/savedLists/hooks';
import { SpacingDiv, PageSpacing, StyledHeader } from './style';

function SavedList({ listUUID }: { listUUID: string }) {
  const { savedLists, isLoading, removeEntitiesFromList } = useSavedLists();
  const savedList = savedLists[listUUID];

  if (isLoading) {
    return (
      <Stack>
        <Skeleton variant="rectangular" height={100} />;
        <Skeleton variant="rectangular" height={100} />;
        <Skeleton variant="rectangular" height={100} />;
        <Skeleton variant="rectangular" height={200} />;
      </Stack>
    );
  }

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
          dateSaved={savedList.dateSaved}
          dateLastModified={savedList.dateLastModified}
        />
      </SpacingDiv>
      <StyledHeader variant="h3">Items</StyledHeader>
      <SavedEntitiesTable savedEntities={listEntities} deleteCallback={deleteCallback} isSavedListPage />
    </PageSpacing>
  );
}

export default SavedList;
