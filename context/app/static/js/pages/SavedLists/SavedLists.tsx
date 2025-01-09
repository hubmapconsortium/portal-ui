import React from 'react';
import { SavedListsContent } from 'js/components/savedLists/SavedListsContent';
import { useSavedLists } from 'js/components/savedLists/hooks';

function SavedLists() {
  const listsData = useSavedLists();
  return <SavedListsContent {...listsData} />;
}

export default SavedLists;
