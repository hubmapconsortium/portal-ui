import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { LightBlueLink } from 'js/shared-styles/Links';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { FlexContainer, Flex, FlexColumn, HubmapLogo, LogoWrapper, Background } from './style';

function Footer(props) {
  const { isMaintenancePage } = props;
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
              <OutboundLink href="https://hubmapconsortium.org/" variant="body2">
                Project Website
              </OutboundLink>
              {!isMaintenancePage && (
                <>
                  <LightBlueLink href="/docs" variant="body2">
                    Documentation
                  </LightBlueLink>
                  <LightBlueLink href="/diversity" variant="body2">
                    Diversity
                  </LightBlueLink>
                </>
              )}
              <EmailIconLink variant="body2" email="help@hubmapconsortium.org" iconFontSize="1rem">
                Submit Feedback
              </EmailIconLink>
            </FlexColumn>
            <FlexColumn $mr={1}>
              <Typography variant="subtitle2">Software</Typography>
              <OutboundLink variant="body2" href="https://github.com/hubmapconsortium">
                GitHub
              </OutboundLink>
              {!isMaintenancePage && (
                <>
                  <LightBlueLink variant="body2" href="/services">
                    Services
                  </LightBlueLink>
                  <LightBlueLink variant="body2" href="/apis">
                    APIs
                  </LightBlueLink>
                </>
              )}
            </FlexColumn>
            <FlexColumn $mr={1}>
              <Typography variant="subtitle2">Policies</Typography>
              <OutboundLink href="https://hubmapconsortium.org/policies/" variant="body2">
                Overview
              </OutboundLink>
              <OutboundLink
                href="https://hubmapconsortium.org/wp-content/uploads/2020/06/DUA_FINAL_2020_02_03_for_Signature.pdf"
                variant="body2"
              >
                Data Use Agreement
              </OutboundLink>
              {!isMaintenancePage && (
                <LightBlueLink href="https://software.docs.hubmapconsortium.org/about#citation" variant="body2">
                  Citing HuBMAP
                </LightBlueLink>
              )}
            </FlexColumn>
            <FlexColumn>
              <Typography variant="subtitle2">Funding</Typography>
              <OutboundLink href="https://commonfund.nih.gov/hubmap" variant="body2">
                NIH Common Fund
              </OutboundLink>
            </FlexColumn>
          </Flex>
          <Typography variant="body1" color="secondary">
            {'Copyright '}
            <OutboundLink href="https://hubmapconsortium.org">
              NIH Human BioMolecular Atlas Program (HuBMAP)
            </OutboundLink>{' '}
            {new Date().getFullYear()}
            {'. All rights reserved. '}
          </Typography>
        </div>
        <div />
      </FlexContainer>
    </Background>
  );
}

Footer.propTypes = {
  isMaintenancePage: PropTypes.bool,
};

Footer.defaultProps = {
  isMaintenancePage: false,
};

export default Footer;
