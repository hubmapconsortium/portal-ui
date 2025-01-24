import React from 'react';

import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import { useAppContext } from 'js/components/Contexts';
import SavedListsContent from 'js/components/savedLists/SavedListsContent';
import { StyledHeader, SpacingDiv, PageSpacing } from 'js/components/savedLists/SavedListsContent/style';

function SavedLists() {
  const { isAuthenticated } = useAppContext();

  return (
    <PageSpacing>
      <StyledHeader variant="h2" data-testid="my-lists-title">
        My Lists
      </StyledHeader>
      <SpacingDiv>
        <LocalStorageDescription />
      </SpacingDiv>
      {isAuthenticated && <SavedListsContent />}
    </PageSpacing>
  );
}

export default SavedLists;
