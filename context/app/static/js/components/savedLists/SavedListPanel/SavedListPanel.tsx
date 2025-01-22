import React from 'react';
import { SavedEntitiesList } from 'js/components/savedLists/types';
import { Panel } from 'js/shared-styles/panels';

import { useSavedEntityTypeCounts } from './hooks';

function SavedListPanel({
  list: { savedEntities, description, title },
  listUUID,
}: {
  list: SavedEntitiesList;
  listUUID: string;
}) {
  const entityCounts = useSavedEntityTypeCounts(savedEntities);

  return <Panel title={title} href={`/my-lists/${listUUID}`} secondaryText={description} entityCounts={entityCounts} />;
}

export default SavedListPanel;
