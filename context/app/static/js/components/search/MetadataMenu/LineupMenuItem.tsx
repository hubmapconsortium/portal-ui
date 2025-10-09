import React from 'react';

import { StyledMenuItem } from './style';
import { useMetadataMenu } from './hooks';
import { useLineUpModalStore } from 'js/stores/useLineUpModalStore';
import { ESEntityType } from 'js/components/types';

interface LineupMenuItemProps {
  lcPluralType: string;
}

// Map plural lowercase entity types to singular capitalized ones, if applicable
const entityTypeMap: Record<string, ESEntityType | undefined> = {
  donors: 'Donor',
  samples: 'Sample',
  datasets: 'Dataset',
  entities: undefined,
};

export default function LineupMenuItem({ lcPluralType }: LineupMenuItemProps) {
  const { selectedHits, closeMenu } = useMetadataMenu();
  const { open } = useLineUpModalStore();

  const entityType = entityTypeMap[lcPluralType];

  const handleClick = () => {
    const uuids = selectedHits.size > 0 ? Array.from(selectedHits) : undefined;
    open({ uuids, entityType });
    closeMenu();
  };

  return (
    <StyledMenuItem
      onClick={handleClick}
      tooltip={`Visualize selected ${lcPluralType}' metadata in Lineup. If no selection exists, all ${lcPluralType} will be included in the visualization.`}
    >
      Visualize
    </StyledMenuItem>
  );
}
