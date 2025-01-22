import React from 'react';

import { InternalLink } from 'js/shared-styles/Links';
import Description from 'js/shared-styles/sections/Description';
import { buildSearchLink } from 'js/components/search/store';
import { useAppContext } from 'js/components/Contexts';

function SearchPagesPrompt({ capitalize }: { capitalize?: boolean }) {
  return (
    <>
      {capitalize ? 'N' : 'n'}avigate to{' '}
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

function LoginPrompt({ endingText }: { endingText: string }) {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <InternalLink href="/login">Login</InternalLink> to view additional saved items{endingText}
    </>
  );
}

function SavedListMessage() {
  return (
    <>
      <LoginPrompt endingText="." /> To explore data to add to this list, <SearchPagesPrompt />, or add items from{' '}
      <InternalLink href="/my-lists">My Lists</InternalLink>
    </>
  );
}

function SavedListsMessage() {
  const { isAuthenticated } = useAppContext();

  return (
    <>
      <LoginPrompt endingText=" or " /> <SearchPagesPrompt capitalize={isAuthenticated} /> to explore data to save
    </>
  );
}

function NoItemsSaved({ isSavedListPage }: { isSavedListPage: boolean }) {
  return <Description>No items saved. {isSavedListPage ? <SavedListMessage /> : <SavedListsMessage />}.</Description>;
}

export default NoItemsSaved;
