import React from 'react';

import Paper from '@material-ui/core/Paper';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function OrganInfo(props) {
  const { uberonIri } = props;

  return (
    <SectionContainer>
      TODO: Add Human Reference Atlas info popover
      <SectionHeader>Human Reference Atlas</SectionHeader>
      <Paper>
        <iframe
          style={{ border: 'none' }}
          title="Organ Info"
          src={`/iframe/organ?iri=${uberonIri}`}
          height="604"
          width="916"
          scrolling="no"
        />
      </Paper>
    </SectionContainer>
  );
}

export default OrganInfo;
