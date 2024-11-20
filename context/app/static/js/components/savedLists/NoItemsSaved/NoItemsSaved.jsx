import React from 'react';

import { InternalLink } from 'js/shared-styles/Links';
import Description from 'js/shared-styles/sections/Description';
import { buildSearchLink } from 'js/components/search/store';

function SearchPagesPrompt() {
  // Inserted in the middle of the message, so it shouldn't be capitalized.
  return (
    <>
      navigate to{' '}
      <InternalLink
        href={buildSearchLink({
          entity_type: 'Donor',
        })}
      >
        donors
      </InternalLink>
      ,{' '}
      <InternalLink
        href={buildSearchLink({
          entity_type: 'Sample',
        })}
      >
        samples
      </InternalLink>{' '}
      or{' '}
      <InternalLink
        href={buildSearchLink({
          entity_type: 'Dataset',
        })}
      >
        datasets
      </InternalLink>{' '}
      search pages
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
