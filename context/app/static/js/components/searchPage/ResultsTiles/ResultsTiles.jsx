import React from 'react';
import PropTypes from 'prop-types';

import EntityTile, { tileWidth } from 'js/components/entity-tile/EntityTile';
import { getTileDescendantCounts } from 'js/components/entity-tile/EntityTile/utils';
import { capitalizeString } from 'js/helpers/functions';
import TileGrid from 'js/shared-styles/tiles/TileGrid';

function ResultsTiles(props) {
  const { hits, type } = props;
  /* eslint-disable no-underscore-dangle */

  const capitalizedType = capitalizeString(type);

  return (
    <TileGrid $tileWidth={tileWidth} data-testid="search-results-tiles">
      {hits.map((hit) => (
        <EntityTile
          key={hit._source.uuid}
          entity_type={capitalizedType}
          uuid={hit._source.uuid}
          id={hit._source.hubmap_id}
          entityData={hit._source}
          descendantCounts={getTileDescendantCounts(hit._source, capitalizedType)}
        />
      ))}
    </TileGrid>
  );
  /* eslint-enable no-underscore-dangle */
}

ResultsTiles.propTypes = {
  type: PropTypes.string.isRequired,
  hits: PropTypes.arrayOf(
    PropTypes.shape({
      sort: PropTypes.array,
      _id: PropTypes.string,
      _index: PropTypes.string,
      _score: PropTypes.number,
      _source: PropTypes.object,
      _type: PropTypes.string,
    }),
  ),
};

ResultsTiles.defaultProps = {
  hits: undefined,
};

export default ResultsTiles;
