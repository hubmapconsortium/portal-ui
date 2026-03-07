import React from 'react';
import Typography from '@mui/material/Typography';

import BulletedList from 'js/shared-styles/lists/bulleted-lists/BulletedList';
import BulletedListItem from 'js/shared-styles/lists/bulleted-lists/BulletedListItem';
import { usePublicationDatasetsAggs } from './hooks';

interface AggsListProps {
  uuid: string;
  field: string;
  associatedCollectionUUID?: string;
}

function AggsList({ uuid, field, associatedCollectionUUID }: AggsListProps) {
  const { searchData } = usePublicationDatasetsAggs({
    descendantUUID: uuid,
    aggsField: field,
    associatedCollectionUUID,
  });

  const buckets = (searchData?.aggregations as Record<string, { buckets?: { key: string }[] }> | undefined)?.[field]
    ?.buckets;

  if (!buckets) {
    return null;
  }

  if (buckets.length === 1) {
    return <Typography>{buckets[0].key}</Typography>;
  }

  return (
    <BulletedList>
      {buckets.map((agg) => (
        <BulletedListItem key={agg.key}>{agg.key}</BulletedListItem>
      ))}
    </BulletedList>
  );
}

export default AggsList;
