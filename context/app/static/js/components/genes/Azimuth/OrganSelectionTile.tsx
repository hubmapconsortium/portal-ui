import EntityTileFooter from 'js/components/entity-tile/EntityTileFooter';
import Tile from 'js/shared-styles/tiles/Tile';
import React from 'react';

interface OrganTileProps {
  name: string;
  uberonId: string;
}

export default function OrganSelectionTile({ name, uberonId }: OrganTileProps) {
  return (
    <Tile
        // icon={<StyledDiv>
        //     <URLSvgIcon iconURL={icon} ariaLabel={`Icon for ${name}`} />
        // </StyledDiv>}
        icon={<div>icon</div>}
        bodyContent={<>
            <Tile.Title>{name}</Tile.Title>
            <Tile.Text>{uberonId}</Tile.Text>
        </>}
        footerContent={<EntityTileFooter descendantCounts={0} />}
        tileWidth={225} 
        invertColors={false}    
    />
  );
}
