import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import { StyledDiv, VerticalDivider } from './styles';

interface SummaryItemProps extends PropsWithChildren {
  statusIcon?: React.ReactNode;
  showDivider?: boolean;
}

function SummaryItem({ children, statusIcon, showDivider = true }: SummaryItemProps) {
  return (
    <StyledDiv>
      {statusIcon}
      <Typography variant="h6" component="p">
        {children}
      </Typography>
      {showDivider && <VerticalDivider orientation="vertical" flexItem />}
    </StyledDiv>
  );
}

export default SummaryItem;
