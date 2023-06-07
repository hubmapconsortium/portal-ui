import React, { useContext } from 'react';
import Paper from '@mui/material/Paper';

import { AppContext } from 'js/components/Providers';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import Description from 'js/shared-styles/sections/Description';
import ServiceStatusTable from 'js/components/ServiceStatusTable';
import { LightBlueLink } from 'js/shared-styles/Links';

function Services() {
  const appContext = useContext(AppContext);
  const { gatewayEndpoint } = appContext;
  const gatewayUrl = `${gatewayEndpoint}/status.json`;
  return (
    <>
      <SectionContainer>
        <SectionHeader variant="h1" component="h1">
          Services
        </SectionHeader>
        <Description>
          {'HuBMAP is powered by a number of APIs. Status information provided by '}
          <LightBlueLink target="_blank" rel="noopener noreferrer" underline="none" href={gatewayUrl}>
            {new URL(gatewayUrl).hostname}
          </LightBlueLink>
          . The HuBMAP Portal software also has a number of{' '}
          <LightBlueLink href="/dependencies">dependencies</LightBlueLink>.
        </Description>
      </SectionContainer>
      <Paper>
        <ServiceStatusTable {...appContext} />
      </Paper>
    </>
  );
}

export default Services;
