import React from 'react';

import { StyledMenuItem } from './style';
import { useMetadataMenu } from './hooks';
import { useLineUpModalStore } from 'js/stores/useLineUpModalStore';
import { useSharedEntityLogic } from './useSharedEntityLogic';

import { trackEvent } from 'js/helpers/trackers';

interface LineupMenuItemProps {
  lcPluralType: string;
  analyticsCategory?: string;
}

export default function LineupMenuItem({ lcPluralType, analyticsCategory }: LineupMenuItemProps) {
  const { closeMenu } = useMetadataMenu();
  const { open } = useLineUpModalStore();

  const queryParams = useSharedEntityLogic(lcPluralType);

  const handleClick = () => {
    open(queryParams);
    trackEvent({
      category: analyticsCategory || 'MetadataMenu',
      action: `Visualize ${lcPluralType} in LineUp`,
    });
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
