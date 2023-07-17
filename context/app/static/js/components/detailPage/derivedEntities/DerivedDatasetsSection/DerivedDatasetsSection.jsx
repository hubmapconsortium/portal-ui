import React, { useState } from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import DerivedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import DerivedEntitiesSectionHeader from 'js/components/detailPage/related-entities/RelatedEntitiesSectionHeader';
import { useDerivedDatasetsSection } from './hooks';

function DerivedDatasetsSection() {
  const {
    entity: { uuid, entity_type },
  } = useFlaskDataContext();

  const [openIndex, setOpenIndex] = useState(0);
  const { entities, isLoading } = useDerivedDatasetsSection(uuid);

  return (
    <DerivedEntitiesSectionWrapper
      isLoading={isLoading}
      sectionId="derived-datasets"
      headerComponent={
        <DerivedEntitiesSectionHeader
          header="Derived Datasets"
          uuid={uuid}
          searchPageHref={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=${entities[openIndex].entity_type}`}
        />
      }
    >
      <RelatedEntitiesTabs
        entities={entities}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        ariaLabel="Derived Datasets Tab"
        renderWarningMessage={(tableEntityType) =>
          `No derived ${tableEntityType.toLowerCase()}s for this ${entity_type.toLowerCase()}.`
        }
      />
    </DerivedEntitiesSectionWrapper>
  );
}

export default DerivedDatasetsSection;
