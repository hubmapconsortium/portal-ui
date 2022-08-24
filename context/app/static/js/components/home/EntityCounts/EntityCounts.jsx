import React from 'react';

import EntityCount from 'js/components/home/EntityCount';
import { DatasetIcon, SampleIcon, DonorIcon, CollectionIcon } from 'js/shared-styles/icons';
import { useEntityCounts } from './hooks';
import { Background, FlexContainer } from './style';

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
];

function EntityCounts() {
  const entityCounts = useEntityCounts();
  return (
    <Background>
      <FlexContainer>
        {entities.map(({ icon, entity_type }) => (
          <EntityCount
            key={entity_type}
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
