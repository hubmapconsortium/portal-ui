import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import Summary from 'js/components/Detail/Summary';
import CollectionDatasetsTable from 'js/components/Detail/CollectionDatasetsTable';
import CollectionsAffiliationsTable from 'js/components/Detail/CollectionsAffiliationsTable';
import useSendUUIDEvent from 'js/components/Detail/useSendUUIDEvent';

function Collection(props) {
  const { collection: collectionData } = props;
  const {
    uuid,
    entity_type,
    display_doi,
    title,
    description,
    create_timestamp,
    last_modified_timestamp,
    contacts,
    datasets,
    creators,
  } = collectionData;

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
            create_timestamp={create_timestamp}
            last_modified_timestamp={last_modified_timestamp}
          >
            <LightBlueLink href="https://www.doi.org" target="_blank" rel="noopener noreferrer" variant="body1">
              doi.org
            </LightBlueLink>
          </Summary>
          {'contacts' in collectionData && <CollectionsAffiliationsTable affiliations={contacts} title="Contacts" />}
          {'datasets' in collectionData && <CollectionDatasetsTable datasets={datasets} />}
          {'creators' in collectionData && <CollectionsAffiliationsTable affiliations={creators} title="Creators" />}
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
