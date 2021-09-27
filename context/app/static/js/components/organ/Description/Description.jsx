import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

import { StyledPaper } from './style';

function Description(props) {
  const { children, uberonIri, uberonShort } = props;

  return (
    <SectionContainer>
      <SectionHeader>Description</SectionHeader>
      <StyledPaper>
        <div>{children}</div>
        <div>
          Uberon: <a href={uberonIri}>{uberonShort}</a>
        </div>
      </StyledPaper>
    </SectionContainer>
  );
}

export default Description;
