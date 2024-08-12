import React from 'react';
import Skeleton from '@mui/material/Skeleton';

import { useOrgan } from 'js/hooks/useOrgansApi';
import URLSvgIcon from 'js/shared-styles/icons/URLSvgIcon';
import { URLSvgIconProps } from './URLSvgIcon/URLSvgIcon';

function OrganIcon({
  organName,
  fontSize = '1.25rem',
  ...iconProps
}: { organName: string } & Partial<URLSvgIconProps>) {
  const { data } = useOrgan(organName);

  const icon = data?.icon;

  if (!icon) {
    return <Skeleton variant="circular" sx={{ height: fontSize, width: fontSize }} />;
  }

  return <URLSvgIcon fontSize={fontSize} iconURL={icon} ariaLabel={`Icon for ${organName}`} {...iconProps} />;
}

export default OrganIcon;
