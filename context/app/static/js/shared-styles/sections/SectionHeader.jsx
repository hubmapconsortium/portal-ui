import React from 'react';
import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledInfoIcon } from './LabelledSectionText/style';

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
  ${(props) =>
    props.$hasTooltip &&
    css`
      display: flex;
      align-items: center;
      svg {
        margin-left: ${props.theme.spacing(0.5)}px;
      }
    `};
`;

function SectionHeader({ children, iconTooltipText, ...rest }) {
  return (
    <StyledTypography variant="h4" component="h2" {...rest} $hasTooltip={Boolean(iconTooltipText)}>
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
