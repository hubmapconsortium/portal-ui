import React, { useState } from 'react';
import { useFlaskDataContext } from 'js/components/Contexts';
import RelatedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import RelatedEntitiesSectionActions from 'js/components/detailPage/related-entities/RelatedEntitiesSectionActions';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { useDerivedEntitiesSection } from './hooks';

const tooltipTexts = {
  Donor: 'Samples and datasets derived from this donor.',
  Sample: 'Datasets derived from this sample.',
  Dataset: 'These datasets include those that have additional processing, such as visualizations.',
} as Record<AllEntityTypes, string>;

function DerivedEntitiesSection() {
  const {
    entity: { uuid, entity_type: entityType },
  } = useFlaskDataContext();
  const [openIndex, setOpenIndex] = useState(0);
  const { entities, datasetUuids, isLoading } = useDerivedEntitiesSection(uuid);

  return (
    <RelatedEntitiesSectionWrapper
      iconTooltipText={tooltipTexts[entityType] ?? ''}
      isLoading={isLoading}
      id="derived-data"
      title="Derived Data"
      action={
        <RelatedEntitiesSectionActions
          uuids={datasetUuids}
          searchPageHref={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${entities[openIndex].entityType}`}
        />
      }
    >
      <RelatedEntitiesTabs
        entities={entities}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        ariaLabel="Derived Data Tabs"
        renderWarningMessage={(tableEntityType) =>
          `No derived ${tableEntityType.toLowerCase()}s for this ${entityType.toLowerCase()}.`
        }
      />
    </RelatedEntitiesSectionWrapper>
  );
}

export default DerivedEntitiesSection;
