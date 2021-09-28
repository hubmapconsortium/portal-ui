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
      TODO: Add table of contents
      <SectionHeader variant="h1" component="h1">
        {organ.name}
      </SectionHeader>
      {organ?.description && (
        <Description uberonIri={organ.uberon} uberonShort={organ.uberon_short}>
          {organ.description}
        </Description>
      )}
      {organ.has_iu_component && <OrganInfo uberonIri={organ.uberon} />}
      {organ?.azimuth && <Azimuth config={organ.azimuth} />}
      {organ.search.length > 0 && (
        <>
          <Assays searchTerms={organ.search} />
          <Samples searchTerms={organ.search} />
        </>
      )}
      TODO: Confirm that we are not still planning to include the old IU component as well?
    </>
  );
}

export default Organ;
