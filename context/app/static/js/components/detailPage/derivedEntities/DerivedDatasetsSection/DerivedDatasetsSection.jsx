import React from 'react';

import DerivedEntitiesSectionWrapper from 'js/components/detailPage/derivedEntities/DerivedEntitiesSectionWrapper';
import DerivedDatasetsTable from 'js/components/detailPage/derivedEntities/DerivedDatasetsTable';
import DerivedEntitiesSectionHeader from 'js/components/detailPage/derivedEntities/DerivedEntitiesSectionHeader';
import { useDerivedDatasetSearchHits } from 'js/hooks/useDerivedEntitySearchHits';

function DerivedDatasetsSection({ uuid }) {
  const entityType = 'Dataset';

  const { searchHits: datasets, isLoading } = useDerivedDatasetSearchHits(uuid);

  return (
    <DerivedEntitiesSectionWrapper
      isLoading={isLoading}
      sectionId={'derived-datasets'}
      headerComponent={
        <DerivedEntitiesSectionHeader
          header="Derived Datasets"
          entityCountsText={`${datasets.length} Datasets`}
          uuid={uuid}
          entityType={entityType}
        />
      }
    >
      <DerivedDatasetsTable entities={datasets} />
    </DerivedEntitiesSectionWrapper>
  );
}

export default DerivedDatasetsSection;
