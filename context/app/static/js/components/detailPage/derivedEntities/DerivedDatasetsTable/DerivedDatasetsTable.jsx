import React from 'react';

import RelatedEntitiesTable from 'js/components/detailPage/related-entities/RelatedEntitiesTable';
import { descendantCountsCol, lastModifiedTimestampCol } from 'js/components/detailPage/derivedEntities/sharedColumns';

function DerivedDatasetsTable({ entities }) {
  const columns = [
    {
      id: 'mapped_data_types',
      label: 'Data Types',
      renderColumnCell: ({ mapped_data_types }) => mapped_data_types.join(', '),
    },
    { id: 'status', label: 'Status', renderColumnCell: ({ status }) => status },
    descendantCountsCol,
    lastModifiedTimestampCol,
  ];

  return <RelatedEntitiesTable columns={columns} entities={entities} />;
}

export default DerivedDatasetsTable;
