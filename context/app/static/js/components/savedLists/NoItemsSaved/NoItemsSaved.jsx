import React from 'react';

import { InternalLink } from 'js/shared-styles/Links';
import Description from 'js/shared-styles/sections/Description';

function SearchPagesPrompt() {
  // Inserted in the middle of the message, so it shouldn't be capitalized.
  return (
    <>
      navigate to <InternalLink href="/search?entity_type[0]=Donor">donors</InternalLink>,{' '}
      <InternalLink href="/search?entity_type[0]=Sample">samples</InternalLink> or{' '}
      <InternalLink href="/search?entity_type[0]=Dataset">datasets</InternalLink> search pages
    </>
  );
}

function LoginPrompt() {
  return (
    <>
      <InternalLink href="/login">Login</InternalLink> to view additional saved items
    </>
  );
}

function SavedListMessage() {
  return (
    <>
      <LoginPrompt />. To explore data to add to this list, <SearchPagesPrompt />, or add items from{' '}
      <InternalLink href="/my-lists">My Lists</InternalLink>{' '}
    </>
  );
}

function SavedListsMessage() {
  return (
    <>
      <LoginPrompt /> or <SearchPagesPrompt /> to explore data to save
    </>
  );
}

function NoItemsSaved({ isSavedListPage }) {
  return (
    <Description padding="20px 20px">
      No items saved. {isSavedListPage ? <SavedListMessage /> : <SavedListsMessage />}.
    </Description>
  );
}

export default NoItemsSaved;
