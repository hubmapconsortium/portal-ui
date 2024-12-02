import React from 'react';
import PropTypes from 'prop-types';

import Tile from 'js/shared-styles/tiles/Tile/';
import EntityTileFooter from 'js/components/entity-tile/EntityTileFooter';
import URLSvgIcon from 'js/shared-styles/icons/URLSvgIcon';
import Box from '@mui/material/Box';
import { OrganFileWithDescendants } from '../types';

const tileWidth = 225;

interface OrganTileProps {
  organ: OrganFileWithDescendants;
  path?: string;
  onClick?: () => void;
  selected?: boolean;
}

function OrganTile({ organ: { name, uberon_short, icon, descendantCounts }, path, onClick, selected }: OrganTileProps) {
  return (
    <Tile
      href={path ? `/organ/${path}` : undefined}
      onClick={onClick}
      ariaLabelText={`Tile representing Organ ${path}`}
      icon={
        <Box mr={1}>
          <URLSvgIcon invertColors={selected} iconURL={icon} ariaLabel={`Icon for ${name}`} />
        </Box>
      }
      bodyContent={
        <>
          <Tile.Title>{name}</Tile.Title>
          <Tile.Text>{uberon_short}</Tile.Text>
        </>
      }
      footerContent={<EntityTileFooter descendantCounts={descendantCounts} />}
      tileWidth={tileWidth}
      invertColors={selected}
      data-testid="organ-tile"
    />
  );
}

OrganTile.propTypes = {
  organ: PropTypes.shape({
    name: PropTypes.string,
    uberon_short: PropTypes.string,
    icon: PropTypes.node,
    descendantCounts: PropTypes.shape({
      Dataset: PropTypes.number,
    }),
  }).isRequired,
};

export { tileWidth };
export default OrganTile;
