import React from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import Summary from 'js/components/detailPage/summary/Summary';
import CollectionDatasetsTable from 'js/components/detailPage/CollectionDatasetsTable';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import useTrackID from 'js/hooks/useTrackID';
import { Collection } from 'js/components/types';

import { getCollectionDOI } from './utils';

function DOILink({ doi_url }: Pick<Collection, 'doi_url'>) {
  if (!doi_url) {
    return null;
  }
  const doi = getCollectionDOI(doi_url);

  return (
    <OutboundIconLink href={doi_url} variant="body1">
      doi:{doi}
    </OutboundIconLink>
  );
}

function CollectionDetail({ collection: collectionData }: { collection: Collection }) {
  const { entity_type, hubmap_id, doi_url, datasets, creators, contributors, contacts } = collectionData;

  useTrackID({ entity_type, hubmap_id });

  // Handle both fields until creators is renamed to contributors.
  const possibleContributors = contributors ?? creators;

  return (
    <div>
      {collectionData && (
        <>
          <Summary title={hubmap_id}>
            <DOILink doi_url={doi_url} />
          </Summary>
          {'datasets' in collectionData && <CollectionDatasetsTable datasets={datasets} />}
          {possibleContributors && Boolean(possibleContributors.length) && (
            <ContributorsTable contributors={possibleContributors} contacts={contacts} title="Contributors" />
          )}
        </>
      )}
    </div>
  );
}

export default CollectionDetail;
