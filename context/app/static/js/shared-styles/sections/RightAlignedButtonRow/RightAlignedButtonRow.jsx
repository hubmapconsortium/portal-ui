import React from 'react';

import { Flex } from './style';

function RightAlignedButtonRow({ leftText, buttons, ...props }) {
  return (
    <Flex {...props}>
      {leftText}
      <div>{buttons}</div>
    </Flex>
  );
}

export default RightAlignedButtonRow;
