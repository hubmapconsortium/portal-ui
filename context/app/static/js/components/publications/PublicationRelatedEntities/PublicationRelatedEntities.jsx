import React, { useState } from 'react';

import RelatedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import RelatedEntitiesSectionHeader from 'js/components/detailPage/related-entities/RelatedEntitiesSectionHeader';
import { lastModifiedTimestampCol } from 'js/components/detailPage/derivedEntities/sharedColumns';

import { useAncestorSearchHits } from './hooks';

function PublicationRelatedEntities({ uuid }) {
  const [openIndex, setOpenIndex] = useState(0);

  const { searchHits: ancestorHits, isLoading } = useAncestorSearchHits(uuid);

  const ancestorsSplitByEntityType = ancestorHits.reduce(
    (acc, ancestor) => {
      const {
        _source: { entity_type },
      } = ancestor;

      if (!entity_type) {
        return acc;
      }

      acc[entity_type].push(ancestor);
      return acc;
    },
    { Donor: [], Sample: [], Dataset: [] },
  );

  const entities = [
    {
      entityType: 'Donor',
      tabLabel: 'Donors',
      data: ancestorsSplitByEntityType.Donor,
      columns: [
        {
          id: 'mapped_metadata.age_value',
          label: 'Age',
          renderColumnCell: ({ mapped_metadata }) => mapped_metadata?.age_value,
        },
        {
          id: 'mapped_metadata.body_mass_index_value',
          label: 'BMI',
          renderColumnCell: ({ mapped_metadata }) => mapped_metadata?.body_mass_index_value,
        },
        {
          id: 'mapped_metadata.sex',
          label: 'Sex',
          renderColumnCell: ({ mapped_metadata }) => mapped_metadata?.sex,
        },
        {
          id: 'mapped_metadata.race',
          label: 'Race',
          renderColumnCell: ({ mapped_metadata }) => mapped_metadata?.race,
        },
        lastModifiedTimestampCol,
      ],
    },
    {
      entityType: 'Sample',
      tabLabel: 'Samples',
      data: ancestorsSplitByEntityType.Sample,
      columns: [
        {
          id: 'origin_samples_unique_mapped_organs.mapped_organ',
          label: 'Organ',
          renderColumnCell: ({ origin_samples_unique_mapped_organs }) => origin_samples_unique_mapped_organs.join(', '),
        },
        { id: 'sample_category', label: 'Sample Category', renderColumnCell: ({ sample_category }) => sample_category },
        lastModifiedTimestampCol,
      ],
    },

    {
      entityType: 'Dataset',
      tabLabel: 'Datasets',
      data: ancestorsSplitByEntityType.Dataset,
      columns: [
        {
          id: 'mapped_data_types',
          label: 'Data Types',
          renderColumnCell: ({ mapped_data_types }) => mapped_data_types.join(', '),
        },

        {
          id: 'origin_samples_unique_mapped_organs.mapped_organ',
          label: 'Organ',
          renderColumnCell: ({ origin_samples_unique_mapped_organs }) => origin_samples_unique_mapped_organs.join(', '),
        },
        { id: 'status', label: 'Status', renderColumnCell: ({ status }) => status },
        lastModifiedTimestampCol,
      ],
    },
  ];

  return (
    <RelatedEntitiesSectionWrapper
      isLoading={isLoading}
      sectionId="publication-entities"
      headerComponent={
        <RelatedEntitiesSectionHeader
          header="Data"
          uuid={uuid}
          searchPageHref={`/search?descendant_ids[0]=${uuid}&entity_type[0]=${entities[openIndex].entityType}`}
        />
      }
    >
      <RelatedEntitiesTabs
        entities={entities}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        ariaLabel="Publication Entities Tabs"
        renderWarningMessage={(tableEntityType) =>
          `No derived ${tableEntityType.toLowerCase()}s for this publication}.`
        }
      />
    </RelatedEntitiesSectionWrapper>
  );
}

export default PublicationRelatedEntities;
