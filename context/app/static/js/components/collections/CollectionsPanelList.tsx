import React, { useMemo } from 'react';
import Skeleton from '@mui/material/Skeleton';

import PanelList from 'js/shared-styles/panels/PanelList';
import { PanelProps } from 'js/shared-styles/panels/Panel';
import { Collection } from 'js/components/collections/types';
import { useFilteredCollections } from 'js/components/collections/hooks';
import CollectionPanel from './CollectionsPanelItem';

const skeletons: PanelProps[] = Array.from({ length: 10 }).map((_, index) => ({
  key: `skeleton-${index}`,
  children: <Skeleton width="100%" height={32} variant="rounded" key={Math.random()} />,
}));

export default function CollectionsPanelList({
  collections,
  isLoading,
}: {
  collections: Collection[];
  isLoading: boolean;
}) {
  const filteredCollections = useFilteredCollections(collections);

  const panelsProps: PanelProps[] = useMemo(() => {
    if (!filteredCollections.length) {
      if (isLoading) return skeletons;
      return [
        {
          children: <>No results found. Try searching for a different collection.</>,
          key: 'no-results',
        },
      ];
    }
    const propsList: PanelProps[] = [
      {
        key: 'header',
        noPadding: true,
        children: <CollectionPanel.Header />,
      },
      ...filteredCollections.map(({ uuid, title, hubmap_id, created_timestamp, datasets }) => ({
        key: uuid,
        noPadding: true,
        noHover: false,
        children: (
          <CollectionPanel.Item
            name={title}
            hubmapId={hubmap_id}
            numDatasets={datasets.length}
            creationDate={created_timestamp}
            href={`/browse/collection/${uuid}`}
          />
        ),
      })),
    ];
    return propsList;
  }, [filteredCollections, isLoading]);

  return <PanelList panelsProps={panelsProps} />;
}
