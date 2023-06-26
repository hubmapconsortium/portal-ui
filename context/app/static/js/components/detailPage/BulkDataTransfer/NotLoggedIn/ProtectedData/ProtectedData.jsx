import React from 'react';
import { StyledContainer } from './style';
import GlobusAccess from './GlobusAccess';
import DbGaP from './DbGaP';
import Links from './Links';

function ProtectedData() {
  return (
    <StyledContainer>
      <GlobusAccess />
      <DbGaP />
      <Links />
    </StyledContainer>
  );
}

export default ProtectedData;
