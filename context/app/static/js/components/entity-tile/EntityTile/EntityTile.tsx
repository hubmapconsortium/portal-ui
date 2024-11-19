import React, { ComponentProps, ComponentType } from 'react';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';

import Tile from 'js/shared-styles/tiles/Tile/';
import { DatasetIcon } from 'js/shared-styles/icons';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import { Dataset, Entity } from 'js/components/types';
import StatusIcon from 'js/components/detailPage/StatusIcon';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconLink from 'js/shared-styles/Links/iconLinks/IconLink';
import { getEntityCreationInfo } from 'js/helpers/functions';
import EntityTileFooter from '../EntityTileFooter/index';
import EntityTileBody from '../EntityTileBody/index';
import { StyledIcon } from './style';

const tileWidth = 310;

interface EntityTileProps
  extends Omit<ComponentProps<typeof Tile>, 'icon' | 'bodyContent' | 'footerContent' | 'tileWidth'>,
    Pick<Entity, 'entity_type'> {
  uuid: string;
  id: string;
  invertColors?: boolean;
  entityData: Partial<Entity> & Partial<Pick<Dataset, 'published_timestamp'>>;
  descendantCounts: Record<string, number>;
}

function EntityTile({ uuid, entity_type, id, invertColors, entityData, descendantCounts, ...rest }: EntityTileProps) {
  const icon: ComponentType = entity_type in entityIconMap ? entityIconMap[entity_type] : DatasetIcon;
  const creationInfo = getEntityCreationInfo({ entity_type, ...entityData });
  return (
    <Tile
      href={`/browse/${entity_type.toLowerCase()}/${uuid}`}
      invertColors={invertColors}
      icon={<StyledIcon as={icon} />}
      bodyContent={
        <EntityTileBody
          entity_type={entity_type}
          id={id}
          invertColors={invertColors}
          entityData={{ ...entityData, entity_type }}
        />
      }
      footerContent={
        <EntityTileFooter invertColors={invertColors} creationInfo={creationInfo} descendantCounts={descendantCounts} />
      }
      tileWidth={tileWidth}
      {...rest}
    />
  );
}

function ErrorTile({ entity_type, id }: Pick<EntityTileProps, 'id' | 'entity_type'>) {
  const entityTypeLowercase = entity_type.toLowerCase();
  const copy = useHandleCopyClick();
  return (
    <Paper
      sx={(theme) => ({
        bgcolor: '#fbebf3',
        width: tileWidth,
        padding: theme.spacing(1),
        borderRadius: theme.spacing(0.5),
        border: `1px solid ${theme.palette.error.main}`,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(1),
      })}
      variant="outlined"
    >
      <Stack direction="row" gap={1}>
        <StatusIcon status="error" sx={{ alignSelf: 'start', fontSize: '1.25rem' }} />
        <Typography variant="body2">
          Unable to load {entityTypeLowercase}. <ContactUsLink capitalize /> with the{' '}
          <IconLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              copy(id);
            }}
            icon={<ContentCopyIcon />}
          >
            {entityTypeLowercase} ID
          </IconLink>
          for more information.
        </Typography>
      </Stack>
    </Paper>
  );
}

export { tileWidth, ErrorTile };
export default EntityTile;
