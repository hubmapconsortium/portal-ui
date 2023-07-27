import React from 'react';
import Paper from '@material-ui/core/Paper';

import { useAppContext } from 'js/components/Contexts';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import Description from 'js/shared-styles/sections/Description';
import ServiceStatusTable from 'js/components/ServiceStatusTable';
import { InternalLink } from 'js/shared-styles/Links';

function Services() {
  const appContext = useAppContext();
  const gatewayUrl = `${appContext.gatewayEndpoint}/status.json`;
  return (
    <>
      <SectionContainer>
        <SectionHeader variant="h1" component="h1">
          Services
        </SectionHeader>
        <Description>
          {'HuBMAP is powered by a number of APIs. Status information provided by '}
          <InternalLink target="_blank" rel="noopener noreferrer" underline="none" href={gatewayUrl}>
            {new URL(gatewayUrl).hostname}
          </InternalLink>
          . The HuBMAP Portal software also has a number of{' '}
          <InternalLink href="/dependencies">dependencies</InternalLink>.
        </Description>
      </SectionContainer>
      <Paper>
        <ServiceStatusTable {...appContext} />
      </Paper>
    </>
  );
}

export default Services;
