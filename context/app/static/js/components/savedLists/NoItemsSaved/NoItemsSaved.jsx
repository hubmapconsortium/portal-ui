import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import Description from 'js/shared-styles/sections/Description';

const SearchPagesPrompt = () => (
  // Inserted in the middle of the message, so it shouldn't be capitalized.
  <>
    navigate to <LightBlueLink href="/search?entity_type[0]=Donor">donors</LightBlueLink>,{' '}
    <LightBlueLink href="/search?entity_type[0]=Sample">samples</LightBlueLink> or{' '}
    <LightBlueLink href="/search?entity_type[0]=Dataset">datasets</LightBlueLink> search pages
  </>
);

const LoginPrompt = () => (
  <>
    <LightBlueLink href="/login">Login</LightBlueLink> to view additional saved items
  </>
);

const SavedListMessage = () => (
  <>
    <LoginPrompt />. To explore data to add to this list, <SearchPagesPrompt />, or add items from{' '}
    <LightBlueLink href="/my-lists">My Lists</LightBlueLink>{' '}
  </>
);

const SavedListsMessage = () => (
  <>
    <LoginPrompt /> or <SearchPagesPrompt /> to explore data to save
  </>
);

function NoItemsSaved({ isSavedListPage }) {
  return (
    <Description padding="20px 20px">
      No items saved. {isSavedListPage ? <SavedListMessage /> : <SavedListsMessage />}.
    </Description>
  );
}

export default NoItemsSaved;
