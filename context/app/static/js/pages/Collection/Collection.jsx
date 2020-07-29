import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'shared-styles/Links';
import Summary from 'components/detail/Summary';
import CollectionDatasetsTable from 'components/detail/CollectionDatasetsTable';
import CollectionCreatorsTable from 'components/detail/CollectionCreatorsTable';

function Collection(props) {
  const { collection: collectionData } = props;
  return (
    <div>
      {collectionData && (
        <>
          <Summary
            uuid={collectionData.uuid}
            entity_type={collectionData.entitytype}
            display_doi={collectionData.display_doi}
            collectionName={collectionData.name}
            description={collectionData.description}
          >
            <LightBlueLink href="https://www.doi.org" target="_blank" rel="noopener noreferrer" variant="body1">
              doi.org
            </LightBlueLink>
          </Summary>
          {'items' in collectionData && <CollectionDatasetsTable datasets={collectionData.items} />}
          {'creators' in collectionData && <CollectionCreatorsTable creators={collectionData.creators} />}
        </>
      )}
    </div>
  );
}

Collection.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  collection: PropTypes.object.isRequired,
};

export default Collection;
