import React from 'react';
import { useEventCallback } from '@mui/material/utils';

import EntityCount from 'js/components/home/EntityCount';
import { DatasetIcon, SampleIcon, DonorIcon, CollectionIcon, OrganIcon } from 'js/shared-styles/icons';
import { buildSearchLink } from 'js/components/search/store';
import { trackEvent } from 'js/helpers/trackers';
import { useEntityCounts } from './hooks';
import { Background, FlexContainer, StyledSvgIcon } from './style';

const entities: {
  icon: typeof DonorIcon;
  entity_type: 'Donor' | 'Sample' | 'Dataset';
}[] = [
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
  const inIframe = window.self !== window.top;
  const handleTrack = useEventCallback((type: string) => {
    trackEvent({
      category: inIframe ? 'Consortium Site Iframe' : 'Homepage',
      action: 'Counts',
      label: `${type}s`,
    });
  });

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
            href={buildSearchLink({
              entity_type,
            })}
            onClick={() => {
              handleTrack(entity_type);
            }}
          />
        ))}
        <EntityCount
          icon={<StyledSvgIcon as={OrganIcon} color="primary" aria-label="Number of unique organs" />}
          count={organsCount}
          label="Organs"
          href="/organs"
          onClick={() => {
            handleTrack('Organ');
          }}
        />
        <EntityCount
          icon={<StyledSvgIcon as={CollectionIcon} aria-label="Number of curated data collections" color="primary" />}
          count={entityCounts?.Collection}
          label="Collections"
          href="/collections"
          onClick={() => {
            handleTrack('Collection');
          }}
        />
      </FlexContainer>
    </Background>
  );
}

export default EntityCounts;
