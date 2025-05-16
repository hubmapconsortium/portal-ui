import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';

import PanelList from 'js/shared-styles/panels/PanelList';
import { PanelProps } from 'js/shared-styles/panels/Panel';
import { useCollections } from 'js/components/collections/hooks';
import { skeletons } from 'js/shared-styles/panels/ResponsivePanelCells';
import CollectionPanel from './CollectionsPanelItem';

export default function CollectionsPanelList() {
  const { filteredCollections, isLoading } = useCollections();

  const panelsProps: PanelProps[] = useMemo(() => {
    if (!filteredCollections.length) {
      if (isLoading) return skeletons;
      return [
        {
          children: <Typography>No results found. Try searching for a different collection.</Typography>,
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
