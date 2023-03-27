import React from 'react';

import BulletedList from 'js/shared-styles/lists/bulleted-lists/BulletedList';
import BulletedListItem from 'js/shared-styles/lists/bulleted-lists/BulletedListItem';
import { useAncestorSearchAggs } from './hooks';

function AggsList({ uuid, field }) {
  const { searchData } = useAncestorSearchAggs(uuid, field);

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
