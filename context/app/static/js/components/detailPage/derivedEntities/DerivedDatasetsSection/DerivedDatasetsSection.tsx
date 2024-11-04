import React, { useState } from 'react';

import DerivedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import RelatedEntitiesSectionActions from 'js/components/detailPage/related-entities/RelatedEntitiesSectionActions';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { useDerivedDatasetsSection } from './hooks';

interface DerivedDatasetsSectionProps {
  uuid: string;
  entityType: AllEntityTypes;
}

function DerivedDatasetsSection({ uuid, entityType }: DerivedDatasetsSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const { entities, uuids, isLoading } = useDerivedDatasetsSection(uuid);

  return (
    <DerivedEntitiesSectionWrapper
      isLoading={isLoading}
      id="derived-data"
      title="Derived Data"
      action={
        <RelatedEntitiesSectionActions
          uuids={uuids}
          searchPageHref={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=Dataset`}
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
