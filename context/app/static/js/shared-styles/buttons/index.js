import React from 'react';
import styled, { css } from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import ToggleButton from '@material-ui/lab/ToggleButton';

const WhiteBackgroundButtonCSS = css`
  background-color: #fff;
  padding: 10px;
  border-radius: 4px;
`;

const WhiteBackgroundIconButton = styled(IconButton)`
  ${WhiteBackgroundButtonCSS}
`;

const WhiteBackgroundToggleButton = styled(ToggleButton)`
  ${WhiteBackgroundButtonCSS}
  border: 0px;
`;

function TooltipToggleButton(props) {
  const { children, tooltipComponent, tooltipTitle, buttonComponent, ...rest } = props;
  const Tooltip = tooltipComponent;

  const Button = buttonComponent || WhiteBackgroundToggleButton;
  return (
    <Tooltip style={{ height: '100%' }} title={tooltipTitle}>
      <Button {...rest}>{children}</Button>
    </Tooltip>
  );
}

export default TooltipToggleButton;

export { WhiteBackgroundButtonCSS, WhiteBackgroundIconButton, TooltipToggleButton };
