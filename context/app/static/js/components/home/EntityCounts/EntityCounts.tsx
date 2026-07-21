import React from 'react';
import { useEventCallback } from '@mui/material/utils';

import EntityCount from 'js/components/home/EntityCount';
import { DatasetIcon, SampleIcon, DonorIcon, CollectionIcon, PublicationIcon } from 'js/shared-styles/icons';
import { buildSearchLink } from 'js/components/search/store';
import { trackEvent } from 'js/helpers/trackers';
import { useEntityCounts } from './hooks';
import { Background, FlexContainer, StyledSvgIcon } from './style';

interface EntityCountConfig {
  icon: typeof DonorIcon;
  entity_type: 'Donor' | 'Sample' | 'Dataset' | 'Publication' | 'Collection' | 'Organ';
  href: string;
  label: string;
}

const entities: EntityCountConfig[] = [
  {
    icon: DonorIcon,
    entity_type: 'Donor',
    href: buildSearchLink({
      entity_type: 'Donor',
    }),
    label: 'Donors',
  },
  {
    icon: SampleIcon,
    entity_type: 'Sample',
    href: buildSearchLink({
      entity_type: 'Sample',
    }),
    label: 'Samples',
  },
  {
    icon: DatasetIcon,
    entity_type: 'Dataset',
    href: buildSearchLink({
      entity_type: 'Dataset',
    }),
    label: 'Datasets',
  },
  {
    icon: CollectionIcon,
    entity_type: 'Collection',
    href: '/collections',
    label: 'Collections',
  },
  {
    icon: PublicationIcon,
    entity_type: 'Publication',
    href: '/publications',
    label: 'Publications',
  },
];

function EntityCounts() {
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
        {entities.map(({ icon, entity_type, ...props }) => (
          <EntityCount
            key={entity_type}
            icon={
              <StyledSvgIcon as={icon} color="primary" aria-label={`Number of unique ${entity_type.toLowerCase()}s`} />
            }
            count={entityCounts?.[entity_type]}
            {...props}
            onClick={() => {
              handleTrack(entity_type);
            }}
          />
        ))}
      </FlexContainer>
    </Background>
  );
}

export default EntityCounts;
