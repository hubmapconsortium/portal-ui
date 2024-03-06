import React from 'react';
import TableCell, { TableCellProps } from '@mui/material/TableCell';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { InfoIcon } from 'js/shared-styles/icons';
import { Flex, StyledSvgIcon } from './style';

interface IconTooltipCellProps {
  children: React.ReactNode;
  tooltipTitle?: string;
  icon?: React.ComponentType;
}

function IconTooltipCell({ children, tooltipTitle, icon, ...rest }: IconTooltipCellProps & TableCellProps) {
  return (
    <TableCell {...rest}>
      <Flex>
        {children}
        {tooltipTitle && (
          <SecondaryBackgroundTooltip title={tooltipTitle} placement="bottom-start">
            <StyledSvgIcon component={icon ?? InfoIcon} color="primary" />
          </SecondaryBackgroundTooltip>
        )}
      </Flex>
    </TableCell>
  );
}

export default IconTooltipCell;
