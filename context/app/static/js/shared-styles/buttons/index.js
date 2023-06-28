import React from 'react';
import styled, { css } from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Button from '@material-ui/core/Button';

const iconButtonHeight = 40;

const WhiteBackgroundButtonCSS = css`
  background-color: #fff;
  height: ${iconButtonHeight}px;
  width: ${iconButtonHeight}px;
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

function TooltipToggleButton({
  children,
  tooltipComponent,
  tooltipTitle,
  buttonComponent: _buttonComponent,
  id,
  ...rest
}) {
  const Tooltip = tooltipComponent;

  return (
    <Tooltip title={tooltipTitle}>
      <WhiteBackgroundToggleButton {...rest} id={id} data-testid={id}>
        {children}
      </WhiteBackgroundToggleButton>
    </Tooltip>
  );
}

const WhiteTextButton = styled(Button)`
  color: #fff;
`;

export default TooltipToggleButton;

export { WhiteBackgroundButtonCSS, WhiteBackgroundIconButton, TooltipToggleButton, iconButtonHeight, WhiteTextButton };
