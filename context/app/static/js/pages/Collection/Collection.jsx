import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import Summary from 'js/components/Detail/Summary';
import CollectionDatasetsTable from 'js/components/Detail/CollectionDatasetsTable';
import CollectionCreatorsTable from 'js/components/Detail/CollectionCreatorsTable';

import useSendUUIDEvent from 'js/components/Detail/useSendUUIDEvent';

function Collection(props) {
  const { collection: collectionData } = props;
  const { uuid, entitytype, display_doi, name, description } = collectionData;

  useSendUUIDEvent(entitytype, collectionData);

  return (
    <div>
      {collectionData && (
        <>
          <Summary
            uuid={uuid}
            entity_type={entitytype}
            display_doi={display_doi}
            collectionName={name}
            description={description}
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
