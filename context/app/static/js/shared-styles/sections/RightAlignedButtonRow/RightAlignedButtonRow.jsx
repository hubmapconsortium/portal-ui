import React from 'react';

import { Flex } from './style';

function RightAlignedButtonRow({ leftText, buttons }) {
  return (
    <Flex>
      {leftText}
      <div>{buttons}</div>
    </Flex>
  );
}

export default RightAlignedButtonRow;
