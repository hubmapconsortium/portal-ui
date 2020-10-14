import React from 'react';
// import Typography from '@material-ui/core/Typography';

import SectionHeader from 'js/components/Detail/SectionHeader';
import SectionContainer from 'js/components/Detail/SectionContainer';
import Description from 'js/components/Detail/Description';

function ServiceStatus() {
  return (
    <>
      <SectionContainer id="summary">
        <SectionHeader variant="h1" component="h1">
          Services
        </SectionHeader>
        <Description>
          The HuBMAP Data Portal is powered by a number of APIs. The current status of each is available here, along
          with a link to the source code.
        </Description>
      </SectionContainer>
    </>
  );
}

export default ServiceStatus;
