import React from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

import { StyledPaper } from './style';

function Description(props) {
  const { children, uberonIri, uberonShort } = props;

  return (
    <StyledPaper>
      <p>{children}</p>
      <p>
        Uberon:{' '}
        <OutboundIconLink href={uberonIri} iconFontSize="1rem">
          {uberonShort}
        </OutboundIconLink>
      </p>
    </StyledPaper>
  );
}

export default Description;
