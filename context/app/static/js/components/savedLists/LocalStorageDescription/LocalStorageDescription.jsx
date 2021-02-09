import React from 'react';

import { Description } from 'js/shared-styles/sections/Description';
import { StyledDiv } from './style';

function LocalStorageDescription() {
  return (
    <StyledDiv>
      <Description padding="20px 20px">
        Your lists are currently stored on local storage and are not transferable between devices.
      </Description>
    </StyledDiv>
  );
}

export default LocalStorageDescription;
