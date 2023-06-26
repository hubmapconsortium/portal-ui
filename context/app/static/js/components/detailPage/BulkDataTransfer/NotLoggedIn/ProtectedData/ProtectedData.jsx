import React from 'react';
import { StyledContainer } from './style';
import GlobusAccess from './GlobusAccess';
import DbGaP from './DbGaP';

function ProtectedData() {
  return (
    <StyledContainer>
      <GlobusAccess />
      <DbGaP />
    </StyledContainer>
  );
}

export default ProtectedData;
