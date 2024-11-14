import React from 'react';
import { format } from 'date-fns/format';

import Tile from 'js/shared-styles/tiles/Tile';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { FooterIcon } from './style';

interface EntityTileFooterProps {
  creationInfo?: { creationTimestamp?: number; creationVerb: string };
  descendantCounts: Record<string, number>;
  invertColors?: boolean;
}

function EntityTileFooter({ creationInfo, invertColors, descendantCounts = {} }: EntityTileFooterProps) {
  const entries = Object.entries(descendantCounts) as [keyof typeof entityIconMap, number][];
  const { creationTimestamp, creationVerb } = creationInfo ?? {};
  return (
    <>
      {entries.map(([k, v]) => (
        <React.Fragment key={k}>
          {k in entityIconMap && <FooterIcon as={entityIconMap[k]} />}
          <Tile.Text>{v}</Tile.Text>
          <Tile.Divider invertColors={invertColors} />
        </React.Fragment>
      ))}
      {creationTimestamp && <Tile.Text>{`${creationVerb} ${format(creationTimestamp, 'yyyy-MM-dd')}`}</Tile.Text>}
    </>
  );
}

export default EntityTileFooter;
