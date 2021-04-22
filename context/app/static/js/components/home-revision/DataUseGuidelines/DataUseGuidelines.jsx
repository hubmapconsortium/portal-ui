import React from 'react';

import { LightBlueLink } from 'js/shared-styles/Links';
import { StyledPaper, MainText, StyledEmailIcon } from './style';

function DataUseGuidelines() {
  return (
    <StyledPaper>
      <MainText mt={1} variant="body1">
        The majority of data available on the HuBMAP Portal is open access data to be used for research of human
        biology. Certain data types with potential for re-identification are available in restricted access either
        directly through this portal by login-dependent permissions or through dbGAP. All data users are expected to
        respect the privacy and confidentiality of the donors who provided samples. Data are not to be used to
        re-identify donors or their family members without further approval from HuBMAP.
      </MainText>
      <MainText mt={2} variant="body1">
        Please direct any questions to{' '}
        <LightBlueLink href="mailto:help@hubmapconsortium.org">
          help@hubmapconsortium.org <StyledEmailIcon />
        </LightBlueLink>
      </MainText>
    </StyledPaper>
  );
}

export default DataUseGuidelines;
