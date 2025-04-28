import React from 'react';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import { FlexLink, StyledDiv } from './style';
import { formatCount } from './utils';

interface EntityCountProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  href: string;
  onClick?: () => void;
}

function EntityCount({ icon, count, label, href, onClick }: EntityCountProps) {
  const title = count ? `${count} ${label}` : '';
  return (
    <SecondaryBackgroundTooltip title={title} placement="bottom" disabled={!count || count < 10000}>
      <FlexLink href={href} onClick={onClick}>
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
