import React, { ElementType } from 'react';
import Skeleton from '@mui/material/Skeleton';

import { useOrgan } from 'js/hooks/useOrgansApi';
import URLSvgIcon from 'js/shared-styles/icons/URLSvgIcon';
import { URLSvgIconProps } from './URLSvgIcon/URLSvgIcon';

type OrganIconProps = { organName: string; component?: ElementType } & Partial<URLSvgIconProps>;

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
      fontSize={fontSize}
      iconURL={icon}
      ariaLabel={`Icon for ${organName}`}
      {...componentProp}
      {...iconProps}
    />
  );
}

export default OrganIcon;
