import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledInfoIcon } from './LabelledSectionText/style';

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

function SectionHeader({ children, iconTooltipText, ...rest }) {
  console.log(iconTooltipText);
  return (
    <StyledTypography variant="h4" component="h2" {...rest}>
      {children}
      {iconTooltipText && (
        <SecondaryBackgroundTooltip title={iconTooltipText}>
          <StyledInfoIcon color="primary" />
        </SecondaryBackgroundTooltip>
      )}
    </StyledTypography>
  );
}

export default SectionHeader;
