/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledDiv, Flex, StyledInfoIcon } from './style';

function LabelledSectionText(props) {
  const { children, label, iconTooltipText, bottomSpacing, className } = props;
  return (
    <StyledDiv className={className} $bottomSpacing={bottomSpacing}>
      <Flex>
        <Typography variant="subtitle2" component="h3" color="primary">
          {label}
        </Typography>
        {iconTooltipText && (
          <SecondaryBackgroundTooltip title="Citation is provided in NLM format. If DataCite page is available, click button to view alternate ways to cite.">
            <StyledInfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        )}
      </Flex>
      <Typography variant="body1">{children}</Typography>
    </StyledDiv>
  );
}

LabelledSectionText.propTypes = {
  label: PropTypes.string.isRequired,
  iconTooltipText: PropTypes.string,
  bottomSpacing: PropTypes.number,
};

LabelledSectionText.defaultProps = {
  iconTooltipText: undefined,
  bottomSpacing: undefined,
};

export default LabelledSectionText;
