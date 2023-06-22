import React from 'react';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import { FlexLink, StyledDiv } from './style';
import { formatCount } from './utils';

function EntityCount({ icon, count, label, href }) {
  return (
    <SecondaryBackgroundTooltip title={`${count} ${label}`} placement="bottom-end">
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
