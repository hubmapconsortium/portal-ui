import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Background, MainText, StyledLink } from './style';

function DataUseGuidelines() {
  return (
    <Background>
      <Typography component="h2" variant="h4">
        Data Use Guidelines
      </Typography>
      <MainText mt={1} variant="body1">
        The majority of Data available on the HuBMAP Portal is Open Access Data to be used for Research of Human
        Biology. Certain Data types with potential for re-identification are available in restricted access either
        directly through this Portal by login-dependent permissions or through dbGAP. All Data users are expected to
        respect the privacy and confidentiality of the donors who provided samples. Data are not to be used to
        re-identify donors or their family members without further approval from HuBMAP.
      </MainText>
      <MainText mt={2} variant="body1">
        Please direct any questions to{' '}
        <StyledLink variant="body1" href="mailto:help@hubmapconsortium.org">
          help@hubmapconsortium.org
        </StyledLink>
        .
      </MainText>
    </Background>
  );
}

export default React.memo(DataUseGuidelines);
