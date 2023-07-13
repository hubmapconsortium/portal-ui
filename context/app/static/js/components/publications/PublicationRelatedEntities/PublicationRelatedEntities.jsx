import React, { useState } from 'react';

import RelatedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import RelatedEntitiesSectionHeader from 'js/components/detailPage/related-entities/RelatedEntitiesSectionHeader';
import { usePublicationsRelatedEntities } from './hooks';

function PublicationRelatedEntities({ uuid }) {
  const [openIndex, setOpenIndex] = useState(0);

  const { entities, isLoading } = usePublicationsRelatedEntities(uuid);
  return (
    <RelatedEntitiesSectionWrapper
      isLoading={isLoading}
      sectionId="data"
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
