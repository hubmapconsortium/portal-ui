import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import Description from 'js/shared-styles/sections/Description';

function NoItemsSaved({ isSavedListPage }) {
  return (
    <Description padding="20px 20px">
      No items saved. Navigate to <LightBlueLink href="/search?entity_type[0]=Donor">donors</LightBlueLink>,{' '}
      <LightBlueLink href="/search?entity_type[0]=Sample">samples</LightBlueLink> or{' '}
      <LightBlueLink href="/search?entity_type[0]=Dataset">datasets</LightBlueLink> search pages to explore data to save
      {isSavedListPage && (
        <>
          or navigate to <LightBlueLink href="/my-lists">My Lists</LightBlueLink> to add items to this list
        </>
      )}
      .
    </Description>
  );
}

export default NoItemsSaved;
