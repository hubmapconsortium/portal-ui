import React from 'react';
import PropTypes from 'prop-types';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import Summary from 'js/components/detailPage/Summary';
import CollectionDatasetsTable from 'js/components/detailPage/CollectionDatasetsTable';
import CollectionsAffiliationsTable from 'js/components/detailPage/CollectionsAffiliationsTable';
import useSendUUIDEvent from 'js/components/detailPage/useSendUUIDEvent';

import { StyledOpenInNewRoundedIcon } from './style';

function Collection(props) {
  const { collection: collectionData } = props;
  const {
    uuid,
    entity_type,
    hubmap_id,
    doi_url,
    title,
    description,
    created_timestamp,
    last_modified_timestamp,
    contacts,
    datasets,
    creators,
  } = collectionData;

  const doi = new URL(doi_url).pathname.slice(1);

  useSendUUIDEvent(entity_type, collectionData);

  return (
    <div>
      {collectionData && (
        <>
          <Summary
            uuid={uuid}
            entity_type={entity_type}
            hubmap_id={hubmap_id}
            collectionName={title}
            description={description}
            created_timestamp={created_timestamp}
            last_modified_timestamp={last_modified_timestamp}
            entityCanBeSaved={false}
            contributors={creators}
            citationTitle={title}
            doi_url={doi_url}
            doi={doi}
          >
            {doi_url && (
              <OutboundLink href={doi_url} variant="body1">
                doi:{doi} <StyledOpenInNewRoundedIcon />
              </OutboundLink>
            )}
          </Summary>
          {'contacts' in collectionData && <CollectionsAffiliationsTable affiliations={contacts} title="Contacts" />}
          {'datasets' in collectionData && <CollectionDatasetsTable datasets={datasets} />}
          {'creators' in collectionData && (
            <CollectionsAffiliationsTable affiliations={creators} title="Contributors" />
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
