import React from 'react';
import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/components/Detail/SectionHeader';
import SectionContainer from 'js/components/Detail/SectionContainer';
import Description from 'js/components/Detail/Description';
import ServiceStatusTable from 'js/components/ServiceStatusTable';

function Services() {
  return (
    <>
      <SectionContainer id="summary">
        <SectionHeader variant="h1" component="h1">
          Services
        </SectionHeader>
        <Description>
          {'HuBMAP is powered by a number of APIs. '}
          {'The Portal depends directly on only search-api, entity-api, and assets. '}
          {'Other services use the others listed below. '}
        </Description>
      </SectionContainer>
      <Paper>
        <ServiceStatusTable />
      </Paper>
    </>
  );
}

export default Services;
