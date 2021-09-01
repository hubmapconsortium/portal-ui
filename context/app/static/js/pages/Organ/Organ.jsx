import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Asctb from 'js/components/organ/Asctb';
import Azimuth from 'js/components/organ/Azimuth';
import Assays from 'js/components/organ/Assays';
import Description from 'js/components/organ/Description';
import Samples from 'js/components/organ/Samples';

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
    <>
      <SectionHeader variant="h1" component="h1">
        {organ.title}
      </SectionHeader>
      {shouldDisplaySection.description && <Description description={organ.description} />}
      {shouldDisplaySection.asctb && <Asctb asctb={organ.asctb} />}
      {shouldDisplaySection.azimuth && <Azimuth description={organ.azimuth} />}
      {shouldDisplaySection.assays && <Assays title={organ.title} />}
      {shouldDisplaySection.samples && <Samples title={organ.title} />}
    </>
  );
}

export default Organ;
