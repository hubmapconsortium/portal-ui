import React from 'react';

import Tile from 'js/shared-styles/tiles/Tile/';
import EntityTileFooter from 'js/components/entity-tile/EntityTileFooter';
import { StyledDiv, ColoredImage } from './style';

const tileWidth = 225;

function OrganTile({ organ: { name, uberon_short, icon, descendantCounts }, path }) {
  return (
    <Tile
      href={`/organ/${path}`}
      icon={
        <StyledDiv>
          <ColoredImage icon={icon} role="img" aria-label={`Icon for ${name}`} />
        </StyledDiv>
      }
      bodyContent={
        <>
          <Tile.Title>{name}</Tile.Title>
          <Tile.Text>{uberon_short}</Tile.Text>
        </>
      }
      footerContent={<EntityTileFooter descendantCounts={descendantCounts} />}
      tileWidth={tileWidth}
    />
  );
}

export { tileWidth };
export default OrganTile;
