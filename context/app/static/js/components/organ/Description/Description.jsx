import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

import { StyledPaper } from './style';

function Description(props) {
  const { children } = props;

  return (
    <SectionContainer>
      <SectionHeader>Description</SectionHeader>
      <StyledPaper>{children}</StyledPaper>
    </SectionContainer>
  );
}

export default Description;
