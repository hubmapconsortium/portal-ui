import React from 'react';

import { StyledMenuItem } from './style';
import { useMetadataMenu } from './hooks';
import { useLineUpModalStore } from 'js/stores/useLineUpModalStore';
import { useSharedEntityLogic } from './useSharedEntityLogic';

interface LineupMenuItemProps {
  lcPluralType: string;
}

export default function LineupMenuItem({ lcPluralType }: LineupMenuItemProps) {
  const { closeMenu } = useMetadataMenu();
  const { open } = useLineUpModalStore();

  const queryParams = useSharedEntityLogic(lcPluralType);

  const handleClick = () => {
    open(queryParams);
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
