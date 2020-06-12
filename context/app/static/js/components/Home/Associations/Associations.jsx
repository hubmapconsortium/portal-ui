import React from 'react';
// eslint-disable-next-line import/no-unresolved
import NihLogo from 'images/nih-logo.png';
import AssociationsCard from '../AssociationsCard';
import { Background, StyledImage, PersonLogo, TextLogo, Flex, StyledContainer } from './style';

function HubmapLogos() {
  return (
    <Flex>
      <PersonLogo />
      <TextLogo />
    </Flex>
  );
}

function Associations() {
  return (
    <Background>
      <StyledContainer>
        <AssociationsCard
          title="HuBMAP Consortium"
          text="Members of the HuBMAP Consortium are developing the tools to create an open, global atlas of the human body at the..."
        >
          <HubmapLogos />
        </AssociationsCard>
        <AssociationsCard
          title="NIH Common Fund"
          text="The NIH Common Fund is a component of the NIH budget which is managed by the Office of Strategic Communication..."
        >
          <StyledImage src={NihLogo} alt="NIH Logo" />
        </AssociationsCard>
        <AssociationsCard
          title="HuBMAP Data Submission"
          text="User authentication is required to generate HuBMAP IDs, please click the button below and you will be redirected to....
"
        >
          <HubmapLogos />
        </AssociationsCard>
      </StyledContainer>
    </Background>
  );
}

export default Associations;
