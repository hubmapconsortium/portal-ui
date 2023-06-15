/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledDiv, Flex, StyledInfoIcon } from './style';

function LabelledSectionText({
  children,
  label,
  iconTooltipText,
  bottomSpacing,
  className,
  childContainerComponent = 'p',
  fontWeight = 400,
}) {
  return (
    <StyledDiv className={className} $bottomSpacing={bottomSpacing}>
      <Flex>
        <Typography variant="subtitle2" component="h3" color="primary" style={{ fontWeight }}>
          {label}
        </Typography>
        {iconTooltipText && (
          <SecondaryBackgroundTooltip title={iconTooltipText}>
            <StyledInfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        )}
      </Flex>
      <Typography component={childContainerComponent} variant="body1">
        {children}
      </Typography>
    </StyledDiv>
  );
}

LabelledSectionText.propTypes = {
  label: PropTypes.string.isRequired,
  iconTooltipText: PropTypes.string,
  bottomSpacing: PropTypes.number,
  childContainerComponent: PropTypes.elementType,
  fontWeight: PropTypes.number,
};

LabelledSectionText.defaultProps = {
  iconTooltipText: undefined,
  bottomSpacing: undefined,
  childContainerComponent: undefined,
  fontWeight: undefined,
};

export default LabelledSectionText;
