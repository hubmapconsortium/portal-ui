import React from 'react';

import Tile from 'js/shared-styles/tiles/Tile';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { FooterIcon } from './style';

interface EntityTileFooterProps {
  descendantCounts: Record<string, number>;
  creationInfo?: { creationDate: string; creationVerb: string };
  invertColors?: boolean;
}

function EntityTileFooter({ creationInfo, invertColors, descendantCounts = {} }: EntityTileFooterProps) {
  const entries = Object.entries(descendantCounts) as [keyof typeof entityIconMap, number][];
  const { creationDate, creationVerb } = creationInfo ?? {};
  return (
    <>
      {entries.map(([k, v]) => (
        <React.Fragment key={k}>
          {k in entityIconMap && <FooterIcon as={entityIconMap[k]} />}
          <Tile.Text>{v}</Tile.Text>
          <Tile.Divider invertColors={invertColors} />
        </React.Fragment>
      ))}
      {creationInfo && <Tile.Text>{`${creationVerb} ${creationDate}`}</Tile.Text>}
    </>
  );
}

export default EntityTileFooter;
