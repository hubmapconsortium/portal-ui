import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Azimuth from 'js/components/organ/Azimuth';
import Assays from 'js/components/organ/Assays';
import Description from 'js/components/organ/Description';
import OrganInfo from 'js/components/organ/OrganInfo';
import Samples from 'js/components/organ/Samples';

function Organ(props) {
  const { organ } = props;

  return (
    <>
      <SectionHeader variant="h1" component="h1">
        {organ.name}
      </SectionHeader>
      {organ?.description && <Description>{organ.description}</Description>}
      {organ?.uberon && <OrganInfo uberonIri={organ.uberon} />}
      {organ?.azimuth && <Azimuth config={organ.azimuth} />}
      {Boolean(organ.search.length) && (
        <>
          <Assays searchTerms={organ.search} />
          <Samples searchTerms={organ.search} />
        </>
      )}
    </>
  );
}

export default Organ;
