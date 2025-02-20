import React from 'react';
import { format } from 'date-fns/format';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import SavedListsDescription from 'js/components/savedLists/SavedListsDescription';
import { SummaryBodyContent } from 'js/components/detailPage/summary/SummaryBody';
import SavedListMenuButton from 'js/components/savedLists/SavedListMenuButton';
import EditListButton from 'js/components/savedLists/EditListButton';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import useSavedLists from 'js/components/savedLists/hooks';
import { SpacedSectionButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/SectionButtonRow';
import { SpacingDiv, PageSpacing, StyledHeader } from './style';

function SavedList({ listUUID }: { listUUID: string }) {
  const { isLoading, savedLists, handleRemoveEntitiesFromList } = useSavedLists();

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={400} />;
  }

  const savedList = savedLists[listUUID];

  if (!savedList) {
    throw new Error('This list does not exist.');
  }

  const { savedEntities: listEntities, title, description } = savedList;
  const entitiesLength = Object.keys(listEntities).length;

  function deleteCallback({ entityUUIDs }: { entityUUIDs: Set<string> }) {
    handleRemoveEntitiesFromList({ listUUID, entityUUIDs }).catch((error) => {
      console.error(error);
    });
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
        <SavedListsDescription />
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
