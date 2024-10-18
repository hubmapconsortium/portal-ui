import React, { useState } from 'react';

import DerivedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import RelatedEntitiesSectionActions from 'js/components/detailPage/related-entities/RelatedEntitiesSectionActions';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { buildSearchLink } from 'js/components/search/store';
import { useDerivedDatasetsSection } from './hooks';

interface DerivedDatasetsSectionProps {
  uuid: string;
  entityType: AllEntityTypes;
}

function DerivedDatasetsSection({ uuid, entityType }: DerivedDatasetsSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const { entities, isLoading } = useDerivedDatasetsSection(uuid);

  return (
    <DerivedEntitiesSectionWrapper
      isLoading={isLoading}
      id="derived-data"
      title="Derived Data"
      action={
        <RelatedEntitiesSectionActions
          searchPageHref={buildSearchLink({
            entity_type: 'Dataset',
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
    </DerivedEntitiesSectionWrapper>
  );
}

export default DerivedDatasetsSection;
