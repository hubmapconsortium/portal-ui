import React from 'react';

import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';
import { descendantCountsCol, lastModifiedTimestampCol } from 'js/components/detailPage/derivedEntities/sharedColumns';

function DerivedSamplesTable({ entities }) {
  const columns = [
    {
      id: 'origin_sample.mapped_organ',
      label: 'Organ',
      renderColumnCell: ({ origin_sample }) => origin_sample?.mapped_organ,
    },
    { id: 'sample_category', label: 'Sample Category', renderColumnCell: ({ sample_category }) => sample_category },
    descendantCountsCol,
    lastModifiedTimestampCol,
  ];

  return <RelatedEntitiesTable columns={columns} entities={entities} />;
}

export default DerivedSamplesTable;
