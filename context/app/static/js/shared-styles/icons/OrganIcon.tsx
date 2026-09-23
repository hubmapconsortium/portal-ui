import React, { ElementType } from 'react';
import Skeleton from '@mui/material/Skeleton';

import { useOrgan } from 'js/hooks/useOrgansApi';
import URLSvgIcon from 'js/shared-styles/icons/URLSvgIcon';
import { URLSvgIconProps } from './URLSvgIcon/URLSvgIcon';
import { mergeSx } from 'js/helpers/styled';

type OrganIconProps = {
  organName: string;
  component?: ElementType;
  // `fontSize` drives both the icon size and the loading skeleton's dimensions. Box no
  // longer carries it as a system prop, so declare it on this component instead.
  fontSize?: string | number;
} & Partial<URLSvgIconProps>;

function OrganIcon({ organName, fontSize = '1.25rem', component, ...iconProps }: OrganIconProps) {
  const { data } = useOrgan(organName);

  const icon = data?.icon;

  // Skeleton's overload typing requires `component` to be defined to enable
  // its polymorphic branch, so spread it conditionally.
  const componentProp = component ? { component } : {};

  if (!icon) {
    return <Skeleton variant="circular" sx={{ height: fontSize, width: fontSize }} {...componentProp} />;
  }

  return (
    <URLSvgIcon
      iconURL={icon}
      ariaLabel={`Icon for ${organName}`}
      {...componentProp}
      {...iconProps}
      sx={mergeSx(
        {
          fontSize: fontSize,
        },
        iconProps.sx,
      )}
    />
  );
}

export default OrganIcon;
