import React, { useState } from 'react';

import RelatedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import RelatedEntitiesSectionHeader from 'js/components/detailPage/related-entities/RelatedEntitiesSectionHeader';
import { descendantCountsCol, lastModifiedTimestampCol } from 'js/components/detailPage/derivedEntities/sharedColumns';

function DerivedEntitiesSection({ samples, datasets, uuid, isLoading, sectionId, entityType }) {
  const [openIndex, setOpenIndex] = useState(0);

  const entities = [
    {
      entityType: 'Sample',
      tabLabel: 'Samples',
      data: samples,
      columns: [
        {
          id: 'origin_sample.mapped_organ',
          label: 'Organ',
          renderColumnCell: ({ origin_sample }) => origin_sample?.mapped_organ,
        },
        { id: 'sample_category', label: 'Sample Category', renderColumnCell: ({ sample_category }) => sample_category },
        descendantCountsCol,
        lastModifiedTimestampCol,
      ],
    },
    {
      entityType: 'Dataset',
      tabLabel: 'Datasets',
      data: datasets,
      columns: [
        {
          id: 'mapped_data_types',
          label: 'Data Types',
          renderColumnCell: ({ mapped_data_types }) => mapped_data_types.join(', '),
        },
        { id: 'status', label: 'Status', renderColumnCell: ({ status }) => status },
        descendantCountsCol,
        lastModifiedTimestampCol,
      ],
    },
  ];

  return (
    <RelatedEntitiesSectionWrapper
      isLoading={isLoading}
      sectionId={sectionId}
      headerComponent={
        <RelatedEntitiesSectionHeader
          header="Derived Samples and Datasets"
          uuid={uuid}
          searchPageHref={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${entities[openIndex].entityType}`}
        />
      }
    >
      <RelatedEntitiesTabs
        entities={entities}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        ariaLabel="Derived Datasets and Samples Tabs"
        renderWarningMessage={(tableEntityType) =>
          `No derived ${tableEntityType.toLowerCase()}s for this ${entityType.toLowerCase()}.`
        }
      />
    </RelatedEntitiesSectionWrapper>
  );
}

export default DerivedEntitiesSection;
