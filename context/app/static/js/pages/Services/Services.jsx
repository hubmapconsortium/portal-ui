import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';

import { AppContext } from 'js/components/Providers';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';
import Description from 'js/shared-styles/sections/Description';
import ServiceStatusTable from 'js/components/ServiceStatusTable';
import { LightBlueLink } from 'js/shared-styles/Links';

function Services() {
  const endpoints = useContext(AppContext);
  const gatewayUrl = `${endpoints.gatewayEndpoint}/status.json`;
  return (
    <>
      <PaddedSectionContainer id="summary">
        <SectionHeader variant="h1" component="h1">
          Services
        </SectionHeader>
        <Description>
          {'HuBMAP is powered by a number of APIs. Status information provided by '}
          <LightBlueLink target="_blank" rel="noopener noreferrer" underline="none" href={gatewayUrl}>
            {new URL(gatewayUrl).hostname}
          </LightBlueLink>
          .
        </Description>
      </PaddedSectionContainer>
      <Paper>
        <ServiceStatusTable {...endpoints} />
      </Paper>
    </>
  );
}

export default Services;
