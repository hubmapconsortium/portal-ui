import React from 'react';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';
import useSavedListsStore from 'js/stores/useSavedListsStore';
import Description from 'js/shared-styles/sections/Description';

const useSavedListsSelector = (state) => ({
  savedLists: state.savedLists,
});

function SavedLists() {
  const { savedLists } = useSavedListsStore(useSavedListsSelector);
  return (
    <>
      <Typography variant="h2" component="h1">
        My Lists
      </Typography>
      <Description padding="20px 20px">
        Your lists are currently stored on local storage and are not transferable between devices.{' '}
      </Description>
      <Typography variant="h3" component="h2">
        My Saves Lists
      </Typography>
      <Description padding="20px 20px">
        No items saved. Navigate to <LightBlueLink href="/search?entity_type[0]=Donor">donors</LightBlueLink>,{' '}
        <LightBlueLink href="/search?entity_type[0]=Sample">samples</LightBlueLink> or{' '}
        <LightBlueLink href="/search?entity_type[0]=Dataset">datasets</LightBlueLink> search pages to explore data to
        save.
      </Description>
      <Typography variant="h3" component="h2">
        All Created Lists
      </Typography>
      <Typography variant="h5" component="h3">
        {Object.keys(savedLists).length} Lists
      </Typography>
      <Description padding="20px 20px">No lists created yet.</Description>
    </>
  );
}

export default SavedLists;
