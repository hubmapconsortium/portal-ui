import React from 'react';

import BulletedList from 'js/shared-styles/lists/bulleted-lists/BulletedList';
import BulletedListItem from 'js/shared-styles/lists/bulleted-lists/BulletedListItem';
import { usePublicationDatasetsAggs } from './hooks';

function AggsList({ uuid, field, associatedCollectionUUID }) {
  const { searchData } = usePublicationDatasetsAggs({
    descendantUUID: uuid,
    aggsField: field,
    associatedCollectionUUID,
  });

  const buckets = searchData?.aggregations?.[field]?.buckets;

  if (buckets) {
    return (
      <BulletedList>
        {buckets.map((agg) => (
          <BulletedListItem key={agg.key}>{agg.key}</BulletedListItem>
        ))}
      </BulletedList>
    );
  }

  return null;
}

export default AggsList;
