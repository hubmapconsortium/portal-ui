import React from 'react';

import { StyledMenuItem } from './style';
import { useMetadataMenu } from './hooks';

interface LineupMenuItemProps {
  lcPluralType: string;
}

export default function LineupMenuItem({ lcPluralType }: LineupMenuItemProps) {
  const { selectedHits } = useMetadataMenu();
  let href = `/lineup/${lcPluralType}`;
  if (selectedHits.size > 0) {
    href += `?uuids=${Array.from(selectedHits).join(',')}`;
  }
  return (
    <StyledMenuItem
      href={href}
      tooltip={`Visualize selected ${lcPluralType}' metadata in Lineup. If no selection exists, all ${lcPluralType} will be included in the visualization.`}
    >
      Visualize
    </StyledMenuItem>
  );
}
