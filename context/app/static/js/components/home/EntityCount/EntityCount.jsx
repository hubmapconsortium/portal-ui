import React from 'react';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import { FlexLink, StyledDiv } from './style';
import { formatCount } from './utils';

function EntityCount({ icon, count, label, href }) {
  return (
    <SecondaryBackgroundTooltip title={count ? `${count} ${label}` : ''} placement="bottom">
      <FlexLink href={href}>
        <StyledDiv>{icon}</StyledDiv>
        <div>
          <Typography variant="h2" component="p">
            {formatCount(count) || <Skeleton />}
          </Typography>
          <Typography variant="h6" component="p">
            {label}
          </Typography>
        </div>
      </FlexLink>
    </SecondaryBackgroundTooltip>
  );
}

export default EntityCount;
