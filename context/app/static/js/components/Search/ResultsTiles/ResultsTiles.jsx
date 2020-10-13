import React from 'react';
import EntityTile from 'js/components/entity-tile/EntityTile';

function ResultsTiles(props) {
  const { hits } = props;
  /* eslint-disable no-underscore-dangle */
  return (
    <>
      {hits.map((hit) => (
        <EntityTile
          entity_type="Dataset"
          uuid={hit._source.uuid}
          id={hit._source.display_doi}
          entityData={hit._source}
          descendantCounts={
            'descendant_counts' in hit._source ? hit._source.descendant_counts.entity_type : { Dataset: 0 }
          }
        />
      ))}
    </>
  );
  /* eslint-enable no-underscore-dangle */
}
export default ResultsTiles;
