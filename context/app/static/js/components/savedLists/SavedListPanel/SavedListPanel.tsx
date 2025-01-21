import React from 'react';
import { SavedEntitiesList } from 'js/components/savedLists/types';
import { Panel } from 'js/shared-styles/panels';

import { useSavedEntityTypeCounts } from './hooks';

function SavedListPanel({ list, listUUID }: { list: SavedEntitiesList; listUUID: string }) {
  const { savedEntities, description, title } = list;
  const entityCounts = useSavedEntityTypeCounts(savedEntities);

  return <Panel title={title} href={`/my-lists/${listUUID}`} secondaryText={description} entityCounts={entityCounts} />;
}

export default SavedListPanel;
