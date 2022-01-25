import React from 'react';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';

import { StyledPaper } from './style';

function Description(props) {
  const { children, uberonIri, uberonShort } = props;

  return (
    <StyledPaper>
      <p>{children}</p>
      <p>
        Uberon: <OutboundLink href={uberonIri}>{uberonShort}</OutboundLink>
      </p>
    </StyledPaper>
  );
}

export default Description;
