import React from 'react';

import SvgIcon from '@mui/material/SvgIcon';
import { UpIcon, DownIcon } from 'js/shared-styles/icons';

function ExpandCollapseIcon({ isExpanded, ...rest }) {
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
