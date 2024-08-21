import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { AllEntityTypes, entityIconMap } from './entityIconMap';

function EntityIcon({ entity_type, ...svgIconProps }: { entity_type: AllEntityTypes } & Partial<SvgIconProps>) {
  return <SvgIcon color="primary" component={entityIconMap[entity_type]} {...svgIconProps} />;
}

export default EntityIcon;
