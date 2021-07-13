import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { Flex } from './style';

function SectionButtonRow({ leftText, buttons, ...props }) {
  return (
    <Flex {...props}>
      {leftText}
      <div>{buttons}</div>
    </Flex>
  );
}

const SpacedSectionButtonRow = styled(SectionButtonRow)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
  min-height: 40px;
`;

const BottomAlignedTypography = styled(Typography)`
  align-self: flex-end;
`;

export { SpacedSectionButtonRow, BottomAlignedTypography };
export default SectionButtonRow;
