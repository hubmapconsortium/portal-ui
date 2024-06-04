import React, { ComponentProps, ComponentType } from 'react';

import Tile from 'js/shared-styles/tiles/Tile/';
import { DatasetIcon } from 'js/shared-styles/icons';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { Entity } from 'js/components/types';
import EntityTileFooter from '../EntityTileFooter/index';
import EntityTileBody from '../EntityTileBody/index';
import { StyledIcon } from './style';

const tileWidth = 310;

interface EntityTileProps
  extends Omit<ComponentProps<typeof Tile>, 'icon' | 'bodyContent' | 'footerContent' | 'tileWidth'> {
  uuid: string;
  entity_type: string;
  id: string;
  invertColors?: boolean;
  entityData: Partial<Entity>;
  descendantCounts: Record<string, number>;
}

function EntityTile({ uuid, entity_type, id, invertColors, entityData, descendantCounts, ...rest }: EntityTileProps) {
  const icon: ComponentType =
    entity_type in entityIconMap ? entityIconMap[entity_type as keyof typeof entityIconMap] : DatasetIcon;
  return (
    <Tile
      href={`/browse/${entity_type.toLowerCase()}/${uuid}`}
      invertColors={invertColors}
      icon={<StyledIcon as={icon} />}
      bodyContent={
        <EntityTileBody entity_type={entity_type} id={id} invertColors={invertColors} entityData={entityData} />
      }
      footerContent={
        <EntityTileFooter
          invertColors={invertColors}
          last_modified_timestamp={entityData.last_modified_timestamp}
          descendantCounts={descendantCounts}
        />
      }
      tileWidth={tileWidth}
      {...rest}
    />
  );
}

export { tileWidth };
export default EntityTile;
