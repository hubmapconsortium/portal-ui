import React from 'react';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';

import { StyledPaper } from './style';

function Description(props) {
  const { children, uberonIri, uberonShort } = props;

  return (
    <SectionContainer>
      <StyledPaper>
        <p>{children}</p>
        <p>
          Uberon: <OutboundLink href={uberonIri}>{uberonShort}</OutboundLink>
        </p>
      </StyledPaper>
    </SectionContainer>
  );
}

export default Description;
