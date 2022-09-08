import React from 'react';

import EntityTile, { tileWidth } from 'js/components/entity-tile/EntityTile';
import { getTileDescendantCounts } from 'js/components/entity-tile/EntityTile/utils';
import TileGrid from 'js/shared-styles/tiles/TileGrid';

function ResultsTiles({ hits }) {
  return (
    <TileGrid $tileWidth={tileWidth} data-testid="search-results-tiles">
      {hits.items.map(({ fields, id }) => {
        return (
          <EntityTile
            key={id}
            entity_type={fields.entity_type}
            uuid={id}
            id={fields.hubmap_id}
            entityData={fields}
            descendantCounts={getTileDescendantCounts(fields, fields.entity_type)}
          />
        );
      })}
    </TileGrid>
  );
}

export default ResultsTiles;
