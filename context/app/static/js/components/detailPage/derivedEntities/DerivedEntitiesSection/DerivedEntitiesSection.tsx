import React, { useState } from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import RelatedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import RelatedEntitiesSectionActions from 'js/components/detailPage/related-entities/RelatedEntitiesSectionActions';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { buildSearchLink } from 'js/components/search/store';
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
  const { entities, isLoading } = useDerivedEntitiesSection(uuid);

  return (
    <RelatedEntitiesSectionWrapper
      iconTooltipText={tooltipTexts[entityType] ?? ''}
      isLoading={isLoading}
      id="derived-data"
      title="Derived Data"
      action={
        <RelatedEntitiesSectionActions
          searchPageHref={buildSearchLink({
            entity_type: entities[openIndex].entityType,
            filters: {
              ancestor_ids: {
                values: [uuid],
                type: 'TERM',
              },
            },
          })}
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
