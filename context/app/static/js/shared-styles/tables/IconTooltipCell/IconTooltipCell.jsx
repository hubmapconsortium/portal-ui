import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { InfoIcon } from 'js/shared-styles/icons';
import { Flex, StyledSvgIcon } from './style';

function IconTooltipCell({ children, tooltipTitle, icon, ...rest }) {
  return (
    <TableCell {...rest}>
      <Flex>
        {children}
        {tooltipTitle && (
          <SecondaryBackgroundTooltip title={tooltipTitle} placement="bottom-start">
            <StyledSvgIcon component={icon || InfoIcon} color="primary" />
          </SecondaryBackgroundTooltip>
        )}
      </Flex>
    </TableCell>
  );
}

IconTooltipCell.propTypes = {
  children: PropTypes.node.isRequired,
  tooltipTitle: PropTypes.string,
  icon: PropTypes.element,
};

IconTooltipCell.defaultProps = {
  tooltipTitle: undefined,
  icon: undefined,
};

export default IconTooltipCell;
