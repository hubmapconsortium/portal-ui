import React from 'react';
import { format } from 'date-fns/format';

import Tile from 'js/shared-styles/tiles/Tile';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { FooterIcon } from './style';

interface EntityTileFooterProps {
  last_modified_timestamp?: number;
  descendantCounts: Record<string, number>;
  invertColors?: boolean;
}

function EntityTileFooter({ last_modified_timestamp, invertColors, descendantCounts = {} }: EntityTileFooterProps) {
  const entries = Object.entries(descendantCounts) as [keyof typeof entityIconMap, number][];
  return (
    <>
      {entries.map(([k, v]) => (
        <React.Fragment key={k}>
          {k in entityIconMap && <FooterIcon as={entityIconMap[k]} />}
          <Tile.Text>{v}</Tile.Text>
          <Tile.Divider invertColors={invertColors} />
        </React.Fragment>
      ))}
      {last_modified_timestamp && <Tile.Text>Modified {format(last_modified_timestamp, 'yyyy-MM-dd')}</Tile.Text>}
    </>
  );
}

export default EntityTileFooter;
