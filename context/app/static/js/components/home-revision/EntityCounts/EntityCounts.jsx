import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from 'js/components/Providers';

import EntityCount from 'js/components/home-revision/EntityCount';
import { DatasetIcon, SampleIcon, DonorIcon, CollectionIcon } from 'js/shared-styles/icons';
import useSearchData from 'js/hooks/useSearchData';
import { Background, FlexContainer } from './style';

const entityCountsQuery = {
  size: 0,
  aggs: { entity_type: { terms: { field: 'entity_type.keyword' } } },
};

const entities = [
  {
    icon: DonorIcon,
    entity_type: 'Donor',
  },
  {
    icon: SampleIcon,
    entity_type: 'Sample',
  },
  {
    icon: DatasetIcon,
    entity_type: 'Dataset',
  },
  // We do not want to show counts for Support entities by default.
];

function EntityCounts() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const [entityCounts, setEntityCountsData] = useState(undefined);
  const { searchData: elasticsearchData } = useSearchData(entityCountsQuery, elasticsearchEndpoint, nexusToken);
  useEffect(() => {
    if (Object.keys(elasticsearchData).length) {
      const entityCountsObject = elasticsearchData.aggregations.entity_type.buckets.reduce((acc, entity) => {
        const accCopy = acc;
        accCopy[entity.key] = entity.doc_count;
        return accCopy;
      }, {});
      setEntityCountsData(entityCountsObject);
    }
  }, [elasticsearchData]);

  return (
    <Background>
      <FlexContainer>
        {entities.map(({ icon, entity_type }) => (
          <EntityCount
            icon={icon}
            count={entityCounts?.[entity_type]}
            label={`${entity_type}s`}
            href={`/search?entity_type[0]=${entity_type}`}
          />
        ))}
        <EntityCount icon={CollectionIcon} count={entityCounts?.Collection} label="Collections" href="/collections" />
      </FlexContainer>
    </Background>
  );
}

export default EntityCounts;
