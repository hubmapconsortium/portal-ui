import React from 'react';
import { Panel } from 'js/shared-styles/panels';

function getEntityCounts(listSavedEntities) {
  const counts = { Donor: 0, Sample: 0, Dataset: 0 };
  Object.values(listSavedEntities).forEach((entity) => {
    counts[entity.entity_type] += 1;
  });
  return counts;
}

function SavedListPanel({ entityObject, listUUID }) {
  const { savedEntities, description, title } = entityObject;
  const counts = getEntityCounts(savedEntities);
  return <Panel title={title} href={`/my-lists/${listUUID}`} secondaryText={description} entityCounts={counts} />;
}

export default SavedListPanel;
