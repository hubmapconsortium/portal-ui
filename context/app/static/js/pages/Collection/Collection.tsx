import React from 'react';

import Summary from 'js/components/detailPage/summary/Summary';
import CollectionDatasetsTable from 'js/components/detailPage/CollectionDatasetsTable';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import useTrackID from 'js/hooks/useTrackID';
import { Collection } from 'js/components/types';

function CollectionDetail({ collection: collectionData }: { collection: Collection }) {
  const { entity_type, hubmap_id, datasets, contributors, contacts } = collectionData;

  useTrackID({ entity_type, hubmap_id });

  return (
    <div>
      {collectionData && (
        <>
          <Summary title={hubmap_id} />
          {'datasets' in collectionData && <CollectionDatasetsTable datasets={datasets} />}
          {contributors && Boolean(contributors.length) && (
            <ContributorsTable contributors={contributors} contacts={contacts} title="Contributors" />
          )}
        </>
      )}
    </div>
  );
}

export default CollectionDetail;
