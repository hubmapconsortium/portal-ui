import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function OrganInfo(props) {
  const { uberonIri } = props;

  return (
    <SectionContainer>
      <SectionHeader>Human Reference Atlas</SectionHeader>
      <iframe title="Organ Info" src={`/iframe/organ?iri=${uberonIri}`} height="604" width="916" scrolling="no" />
    </SectionContainer>
  );
}

export default OrganInfo;
