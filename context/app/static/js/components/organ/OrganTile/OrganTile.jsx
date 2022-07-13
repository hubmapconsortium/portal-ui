import React from 'react';

import Tile from 'js/shared-styles/tiles/Tile/';
import EntityTileFooter from 'js/components/entity-tile/EntityTileFooter';
import { DatasetIcon, SampleIcon, DonorIcon } from 'js/shared-styles/icons';
import { StyledDiv, ColoredImage } from './style';

const entityIconMap = {
  Donor: DonorIcon,
  Sample: SampleIcon,
  Dataset: DatasetIcon,
  Support: DatasetIcon,
};
function OrganTile({ organ: { name, uberon_short, icon, descendantCounts } }) {
  return (
    <Tile
      href={`/organ/${name}`}
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
      footerContent={<EntityTileFooter descendantCounts={descendantCounts} entityIconMap={entityIconMap} />}
    />
  );
}

export default OrganTile;

// alt={``}
