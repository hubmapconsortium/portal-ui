import React from 'react';

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { UpIcon, DownIcon } from 'js/shared-styles/icons';

interface ExpandCollapseIconProps extends SvgIconProps {
  isExpanded: boolean;
}

function ExpandCollapseIcon({ isExpanded, ...rest }: ExpandCollapseIconProps) {
  const iconProps = isExpanded
    ? {
        component: UpIcon,
        'data-testid': 'up-arrow-icon',
      }
    : {
        component: DownIcon,
        'data-testid': 'down-arrow-icon',
      };
  return <SvgIcon {...iconProps} {...rest} />;
}

export default ExpandCollapseIcon;
