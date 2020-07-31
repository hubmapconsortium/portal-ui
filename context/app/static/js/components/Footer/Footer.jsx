import React from 'react';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'shared-styles/Links';
import { FlexContainer, Flex, FlexColumn, HubmapLogo, LogoWrapper, Background } from './style';

function Footer() {
  return (
    <Background>
      <FlexContainer maxWidth="lg">
        <LogoWrapper>
          <HubmapLogo />
        </LogoWrapper>
        <div>
          <Flex>
            <FlexColumn $mr={1}>
              <Typography variant="subtitle2">About</Typography>
              <LightBlueLink
                href="https://hubmapconsortium.org/"
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
              >
                Project Website
              </LightBlueLink>
              <LightBlueLink href="/docs" variant="body2">
                Documentation
              </LightBlueLink>
              <LightBlueLink variant="body2" href="mailto:help@hubmapconsortium.org">
                Contact
              </LightBlueLink>
            </FlexColumn>
            <FlexColumn $mr={1}>
              <Typography variant="subtitle2">Policies</Typography>
              <LightBlueLink
                href="https://hubmapconsortium.org/policies/"
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
              >
                Overview
              </LightBlueLink>
              <LightBlueLink
                href="https://hubmapconsortium.org/wp-content/uploads/2020/06/DUA_FINAL_2020_02_03_for_Signature.pdf"
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
              >
                Data Use Agreement
              </LightBlueLink>
              <LightBlueLink href="/docs/about" variant="body2">
                Citing HuBMAP
              </LightBlueLink>
            </FlexColumn>
            <FlexColumn>
              <Typography variant="subtitle2">Funding</Typography>
              <LightBlueLink
                href="https://commonfund.nih.gov/hubmap"
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
              >
                NIH Common Fund
              </LightBlueLink>
            </FlexColumn>
          </Flex>
          <Typography variant="body1" color="secondary">
            {'Copyright '}
            <LightBlueLink href="https://hubmapconsortium.org" target="_blank" rel="noopener noreferrer">
              NIH Human BioMolecular Atlas Program (HuBMAP)
            </LightBlueLink>{' '}
            {new Date().getFullYear()}
            {'. All rights reserved. '}
          </Typography>
        </div>
        <div />
      </FlexContainer>
    </Background>
  );
}

export default Footer;
