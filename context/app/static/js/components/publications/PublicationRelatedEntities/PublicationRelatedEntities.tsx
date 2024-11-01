import React, { useState } from 'react';

import RelatedEntitiesSectionWrapper from 'js/components/detailPage/related-entities/RelatedEntitiesSectionWrapper';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';
import RelatedEntitiesSectionActions from 'js/components/detailPage/related-entities/RelatedEntitiesSectionActions';
import { usePublicationsRelatedEntities } from './hooks';

interface PublicationRelatedEntitiesProps {
  uuid: string;
}

function PublicationRelatedEntities({ uuid }: PublicationRelatedEntitiesProps) {
  const [openIndex, setOpenIndex] = useState(0);

  const { entities, datasets, isLoading } = usePublicationsRelatedEntities(uuid);
  return (
    <RelatedEntitiesSectionWrapper
      isLoading={isLoading}
      id="data"
      title="Data"
      iconTooltipText="HuBMAP data created or used by the publication."
      action={
        <RelatedEntitiesSectionActions
          datasets={datasets}
          searchPageHref={`/search?descendant_ids[0]=${uuid}&entity_type[0]=${entities[openIndex].entityType}`}
        />
      }
    >
      <RelatedEntitiesTabs
        entities={entities}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
        ariaLabel="Publication Entities Tabs"
        renderWarningMessage={(tableEntityType) => `No derived ${tableEntityType.toLowerCase()}s for this publication.`}
      />
    </RelatedEntitiesSectionWrapper>
  );
}

export default PublicationRelatedEntities;
