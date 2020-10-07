import React from 'react';
import styled, { css } from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';

const WhiteBackgroundButtonCSS = css`
  background-color: #fff;
  height: 40px;
  width: 40px;
  border-radius: 4px;
  padding: 0px;
`;

const WhiteBackgroundIconButton = styled(IconButton)`
  ${WhiteBackgroundButtonCSS}
  svg {
    font-size: 1.25rem;
  }
`;

const WhiteBackgroundToggleButton = styled(ToggleButton)`
  ${WhiteBackgroundButtonCSS}
  border: 0px;
  svg {
    font-size: 1.25rem;
  }
`;

function TooltipToggleButton(props) {
  const { children, tooltipComponent, tooltipTitle, buttonComponent, ...rest } = props;
  const Tooltip = tooltipComponent;

  return (
    <Tooltip title={tooltipTitle}>
      <WhiteBackgroundToggleButton {...rest}>{children}</WhiteBackgroundToggleButton>
    </Tooltip>
  );
}

export default TooltipToggleButton;

export { WhiteBackgroundButtonCSS, WhiteBackgroundIconButton, TooltipToggleButton };
