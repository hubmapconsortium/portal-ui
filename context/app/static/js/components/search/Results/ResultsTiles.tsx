import React from 'react';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import Box from '@mui/material/Box';

import { Entity } from 'js/components/types';
import EntityTile, { tileWidth } from 'js/components/entity-tile/EntityTile';
import { getTileDescendantCounts } from 'js/components/entity-tile/EntityTile/utils';
import { capitalizeString } from 'js/helpers/functions';
import TileGrid from 'js/shared-styles/tiles/TileGrid';
import { useSearch } from '../Search';
import ViewMoreResults from './ViewMoreResults';

function Tile({ hit }: { hit: SearchHit<Partial<Entity>> }) {
  if (!(hit?._source?.hubmap_id && hit?._source.uuid)) {
    return null;
  }

  return (
    <EntityTile
      key={hit?._source?.uuid}
      entity_type={capitalizeString(hit?._source?.entity_type)}
      uuid={hit?._source?.uuid}
      id={hit?._source?.hubmap_id}
      entityData={hit?._source}
      descendantCounts={getTileDescendantCounts(hit?._source, capitalizeString(hit?._source?.entity_type))}
    />
  );
}

function ResultsTiles() {
  const { searchHits: hits } = useSearch();

  return (
    <Box>
      <TileGrid $tileWidth={tileWidth}>
        {hits.map((hit) => (
          <Tile hit={hit} key={hit?._id} />
        ))}
      </TileGrid>
      <ViewMoreResults />
    </Box>
  );
}

export default ResultsTiles;
