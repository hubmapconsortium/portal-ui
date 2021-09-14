import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';

function OrganInfo(props) {
  const { uberonIri } = props;

  return (
    <SectionContainer>
      <SectionHeader>Human Reference Atlas</SectionHeader>
      <ccf-organ-info organ-iri={uberonIri} />
    </SectionContainer>
  );
}

export default OrganInfo;
