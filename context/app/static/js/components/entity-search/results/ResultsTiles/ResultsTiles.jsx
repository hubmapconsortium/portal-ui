import React from 'react';

import EntityTile from 'js/components/entity-tile/EntityTile';
import { getTileDescendantCounts } from 'js/components/entity-tile/EntityTile/utils';
import { TilesLayout } from './style';

function ResultsTiles({ hits }) {
  return (
    <TilesLayout data-testid="search-results-tiles">
      {hits.items.map(({ fields, id }) => {
        return (
          <EntityTile
            key={fields.uuid}
            entity_type={fields.entity_type}
            uuid={id}
            id={fields.hubmap_id}
            entityData={fields}
            descendantCounts={getTileDescendantCounts(fields, fields.entity_type)}
          />
        );
      })}
    </TilesLayout>
  );
}

export default ResultsTiles;
