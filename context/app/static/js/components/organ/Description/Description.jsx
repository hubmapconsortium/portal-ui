import React from 'react';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

import { StyledPaper } from './style';

function Description({ children, uberonIri, uberonShort, asctbId }) {
  return (
    <StyledPaper>
      <p>{children}</p>
      <p>
        Uberon: <OutboundIconLink href={uberonIri}>{uberonShort}</OutboundIconLink>
      </p>
      {asctbId && (
        <p>
          Visit the{' '}
          <OutboundIconLink
            href={`https://hubmapconsortium.github.io/ccf-asct-reporter/vis?selectedOrgans=${asctbId}&playground=false`}
          >
            ASCT+B Reporter
          </OutboundIconLink>
        </p>
      )}
    </StyledPaper>
  );
}

export default Description;
