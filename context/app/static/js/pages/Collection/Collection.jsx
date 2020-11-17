import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import Summary from 'js/components/Detail/Summary';
import CollectionDatasetsTable from 'js/components/Detail/CollectionDatasetsTable';

import useSendUUIDEvent from 'js/components/Detail/useSendUUIDEvent';
import CollectionsAffiliationsTable from 'js/components/Detail/CollectionsAffiliationsTable';

function Collection(props) {
  const { collection: collectionData } = props;
  const { uuid, entity_type, display_doi, title, description } = collectionData;

  useSendUUIDEvent(entity_type, collectionData);

  return (
    <div>
      {collectionData && (
        <>
          <Summary
            uuid={uuid}
            entity_type={entity_type}
            display_doi={display_doi}
            collectionName={title}
            description={description}
          >
            <LightBlueLink href="https://www.doi.org" target="_blank" rel="noopener noreferrer" variant="body1">
              doi.org
            </LightBlueLink>
          </Summary>
          {'items' in collectionData && <CollectionDatasetsTable datasets={collectionData.datasets} />}
          {'creators' in collectionData && (
            <CollectionsAffiliationsTable affiliations={collectionData.creators} title="Creators" />
          )}
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
