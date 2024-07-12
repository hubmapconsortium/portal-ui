import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

import { InternalLink } from 'js/shared-styles/Links';
import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import { FlexContainer, Flex, FlexColumn, HubmapLogo, LogoWrapper, Background } from './style';

function Footer({ isMaintenancePage }) {
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
                  <InternalLink href="/docs" variant="body2">
                    Documentation
                  </InternalLink>
                  <InternalLink href="/diversity" variant="body2">
                    Diversity
                  </InternalLink>
                </>
              )}
              <ContactUsLink variant="body2">Submit Feedback</ContactUsLink>
            </FlexColumn>
            <FlexColumn $mr={1}>
              <Typography variant="subtitle2">Software</Typography>
              <OutboundIconLink variant="body2" href="https://github.com/hubmapconsortium">
                GitHub
              </OutboundIconLink>
              {!isMaintenancePage && (
                <>
                  <InternalLink variant="body2" href="/services">
                    Services
                  </InternalLink>
                  <InternalLink variant="body2" href="/apis">
                    APIs
                  </InternalLink>
                </>
              )}
              <OutboundIconLink
                variant="body2"
                href="https://lookerstudio.google.com/u/0/reporting/bceef6eb-c727-4b6f-ac00-364b280ae8c2/page/p_o7z46wg18c"
              >
                Portal Usage Analytics
              </OutboundIconLink>
            </FlexColumn>
            <FlexColumn $mr={1}>
              <Typography variant="subtitle2">Policies</Typography>
              <OutboundLink href="https://hubmapconsortium.org/policies/" variant="body2">
                Overview
              </OutboundLink>
              <OutboundLink href="https://hubmapconsortium.org/policies/external-data-sharing-policy/" variant="body2">
                Data Sharing Policy
              </OutboundLink>
              {!isMaintenancePage && (
                <OutboundLink href="https://docs.hubmapconsortium.org/about#citation" variant="body2">
                  Citing HuBMAP
                </OutboundLink>
              )}
            </FlexColumn>
            <FlexColumn>
              <Typography variant="subtitle2">Funding</Typography>
              <OutboundIconLink href="https://commonfund.nih.gov/hubmap" variant="body2">
                NIH Common Fund
              </OutboundIconLink>
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
