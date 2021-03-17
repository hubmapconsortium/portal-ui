import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { Flex } from './style';

function RightAlignedButtonRow({ leftText, buttons, ...props }) {
  return (
    <Flex {...props}>
      {leftText}
      <div>{buttons}</div>
    </Flex>
  );
}

const StyledButtonRow = styled(RightAlignedButtonRow)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
  min-height: 40px;
`;

const BottomAlignedTypography = styled(Typography)`
  align-self: flex-end;
`;

export { StyledButtonRow, BottomAlignedTypography };
export default RightAlignedButtonRow;
