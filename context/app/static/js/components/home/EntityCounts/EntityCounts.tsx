import React from 'react';

import EntityCount from 'js/components/home/EntityCount';
import { DatasetIcon, SampleIcon, DonorIcon, CollectionIcon } from 'js/shared-styles/icons';
import { useEntityCounts } from './hooks';
import { Background, FlexContainer, StyledSvgIcon, StyledOrganIcon } from './style';

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

interface EntityCountsProps {
  organsCount: number;
}

function EntityCounts({ organsCount }: EntityCountsProps) {
  const entityCounts = useEntityCounts();
  return (
    <Background>
      <FlexContainer>
        {entities.map(({ icon, entity_type }) => (
          <EntityCount
            key={entity_type}
            icon={
              <StyledSvgIcon as={icon} color="primary" aria-label={`Number of unique ${entity_type.toLowerCase()}s`} />
            }
            count={entityCounts?.[entity_type]}
            label={`${entity_type}s`}
            href={`/search?entity_type[0]=${entity_type}`}
          />
        ))}
        <EntityCount
          icon={<StyledOrganIcon ariaLabel="Number of unique organs" />}
          count={organsCount}
          label="Organs"
          href="/organ"
        />
        <EntityCount
          icon={<StyledSvgIcon as={CollectionIcon} aria-label="Number of curated data collections" color="primary" />}
          count={entityCounts?.Collection}
          label="Collections"
          href="/collections"
        />
      </FlexContainer>
    </Background>
  );
}

export default EntityCounts;
