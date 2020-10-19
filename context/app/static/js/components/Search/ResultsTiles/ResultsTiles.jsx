import React from 'react';
import EntityTile from 'js/components/entity-tile/EntityTile';

import { capitalizeString } from 'js/helpers/functions';
import { TilesLayout } from './style';
import { getDescendantCounts } from './utils';

function ResultsTiles(props) {
  const { hits, type } = props;
  /* eslint-disable no-underscore-dangle */

  const capitalizedType = capitalizeString(type);

  return (
    <TilesLayout>
      {hits.map((hit) => (
        <EntityTile
          key={hit._source.uuid}
          entity_type={capitalizedType}
          uuid={hit._source.uuid}
          id={hit._source.display_doi}
          entityData={hit._source}
          descendantCounts={getDescendantCounts(hit._source, capitalizedType)}
        />
      ))}
    </TilesLayout>
  );
  /* eslint-enable no-underscore-dangle */
}
export default ResultsTiles;
