import React from 'react';

import SavedListsDescription from 'js/components/savedLists/SavedListsDescription';
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
        <SavedListsDescription />
      </SpacingDiv>
      {isAuthenticated && <SavedListsContent />}
    </PageSpacing>
  );
}

export default SavedLists;
