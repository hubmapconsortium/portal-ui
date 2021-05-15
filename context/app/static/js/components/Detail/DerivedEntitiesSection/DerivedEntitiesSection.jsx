import React from 'react';

import DerivedEntitiesSectionWrapper from 'js/components/Detail/DerivedEntitiesSectionWrapper';
import DerivedEntitiesTabs from 'js/components/Detail/DerivedEntitiesTabs';
import DerivedEntitiesSectionHeader from 'js/components/Detail/DerivedEntitiesSectionHeader';

function DerivedEntitiesSection({ samples, datasets, uuid, isLoading, entityType }) {
  return (
    <DerivedEntitiesSectionWrapper isLoading={isLoading}>
      <DerivedEntitiesSectionHeader
        header="Derived Entities"
        entityCountsText={[`${samples.length} Samples`, `${datasets.length} Datasets`].join(' | ')}
        uuid={uuid}
        entityType={entityType}
      />
      <DerivedEntitiesTabs samples={samples} datasets={datasets} />
    </DerivedEntitiesSectionWrapper>
  );
}

export default DerivedEntitiesSection;
