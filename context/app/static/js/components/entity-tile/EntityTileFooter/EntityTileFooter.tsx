import React from 'react';
import { format } from 'date-fns/format';

import Tile from 'js/shared-styles/tiles/Tile';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { getEntityCreationInfo } from 'js/helpers/functions';
import { FooterIcon } from './style';

interface EntityTileFooterProps {
  published_timestamp?: number;
  created_timestamp?: number;
  descendantCounts: Record<string, number>;
  invertColors?: boolean;
}

function EntityTileFooter({
  published_timestamp,
  created_timestamp,
  invertColors,
  descendantCounts = {},
}: EntityTileFooterProps) {
  const entries = Object.entries(descendantCounts) as [keyof typeof entityIconMap, number][];
  const { creationVerb, creationTimestamp } = getEntityCreationInfo({ published_timestamp, created_timestamp });

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
