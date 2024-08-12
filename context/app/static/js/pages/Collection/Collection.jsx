import React from 'react';
import PropTypes from 'prop-types';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import Summary from 'js/components/detailPage/summary/Summary';
import CollectionDatasetsTable from 'js/components/detailPage/CollectionDatasetsTable';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import useTrackID from 'js/hooks/useTrackID';
import { getCollectionDOI } from './utils';

function Collection({ collection: collectionData }) {
  const {
    uuid,
    entity_type,
    hubmap_id,
    doi_url,
    description,
    created_timestamp,
    last_modified_timestamp,
    contacts,
    datasets,
    creators,
  } = collectionData;

  const doi = getCollectionDOI(doi_url);

  useTrackID({ entity_type, hubmap_id });

  return (
    <div>
      {collectionData && (
        <>
          <Summary
            uuid={uuid}
            entity_type={entity_type}
            title={hubmap_id}
            description={description}
            created_timestamp={created_timestamp}
            last_modified_timestamp={last_modified_timestamp}
            contributors={creators}
            doi_url={doi_url}
            doi={doi}
          >
            {doi_url && (
              <OutboundIconLink href={doi_url} variant="body1">
                doi:{doi}
              </OutboundIconLink>
            )}
          </Summary>
          {'contacts' in collectionData && <ContributorsTable contributors={contacts} title="Contacts" />}
          {'datasets' in collectionData && <CollectionDatasetsTable datasets={datasets} />}
          {'creators' in collectionData && <ContributorsTable contributors={creators} title="Contributors" />}
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
