/* eslint-disable react/jsx-props-no-spreading */
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
  const { children, tooltipComponent, tooltipTitle, ...rest } = props;
  const Tooltip = tooltipComponent;
  return (
    <Tooltip title={tooltipTitle}>
      <WhiteBackgroundToggleButton {...rest}>{children}</WhiteBackgroundToggleButton>
    </Tooltip>
  );
}

export default TooltipToggleButton;

export { WhiteBackgroundButtonCSS, WhiteBackgroundIconButton, TooltipToggleButton };
