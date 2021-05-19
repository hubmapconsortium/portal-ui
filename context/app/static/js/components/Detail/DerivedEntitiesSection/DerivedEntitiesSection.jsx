import React, { useState } from 'react';

import DerivedEntitiesSectionWrapper from 'js/components/Detail/DerivedEntitiesSectionWrapper';
import DerivedEntitiesTabs from 'js/components/Detail/DerivedEntitiesTabs';
import DerivedEntitiesSectionHeader from 'js/components/Detail/DerivedEntitiesSectionHeader';

function DerivedEntitiesSection({ samples, datasets, uuid, isLoading, sectionId }) {
  const [openIndex, setOpenIndex] = useState(0);

  const entities = [
    {
      entityType: 'Sample',
      tabLabel: 'Samples',
      data: samples,
    },
    {
      entityType: 'Dataset',
      tabLabel: 'Datasets',
      data: datasets,
    },
  ];
  return (
    <DerivedEntitiesSectionWrapper isLoading={isLoading} sectionId={sectionId}>
      <DerivedEntitiesSectionHeader
        header="Derived Samples and Datasets"
        entityCountsText={[`${samples.length} Samples`, `${datasets.length} Datasets`].join(' | ')}
        uuid={uuid}
        entityType={entities[openIndex].entityType}
      />
      <DerivedEntitiesTabs entities={entities} openIndex={openIndex} setOpenIndex={setOpenIndex} />
    </DerivedEntitiesSectionWrapper>
  );
}

export default DerivedEntitiesSection;
