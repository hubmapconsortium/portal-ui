import React from 'react';
import { Panel } from 'js/shared-styles/panels';

import { useEntityCounts } from './hooks';

function SavedListPanel({ entityObject, listUUID }) {
  const { savedEntities, description, title } = entityObject;
  const counts = useEntityCounts(savedEntities);
  return <Panel title={title} href={`/my-lists/${listUUID}`} secondaryText={description} entityCounts={counts} />;
}

export default SavedListPanel;
