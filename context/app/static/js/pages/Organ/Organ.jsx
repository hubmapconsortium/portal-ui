import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function Organ(props) {
  const { organ } = props;

  const shouldDisplaySection = {
    description: Boolean(organ?.description),
    asctb: Boolean(organ?.asctb),
    azimuth: Boolean(organ?.azimuth),
    assays: true,
    samples: true,
  };

  return (
    <SectionContainer>
      <SectionHeader variant="h1" component="h1">
        {organ.title}
      </SectionHeader>
      <Paper>
        {shouldDisplaySection.description && <>TODO: description</>}
        {shouldDisplaySection.asctb && <>TODO: asctb</>}
        {shouldDisplaySection.azimuth && <>TODO: azimuth</>}
        {shouldDisplaySection.assays && <>TODO: assays</>}
        {shouldDisplaySection.samples && <>TODO: samples</>}
      </Paper>
    </SectionContainer>
  );
}

export default Organ;
