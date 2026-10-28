import React from 'react';

import LightThemePaper from 'js/shared-styles/surfaces/LightThemePaper';

import CCFOrganInfo from 'js/components/HRA/CCFOrganInfo';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { useOrganContext } from 'js/components/organ/contexts';
import { OrganPageIds } from 'js/components/organ/types';
import OrganDetailSection from 'js/components/organ/OrganDetailSection';

function HumanReferenceAtlas() {
  const {
    organ: { uberon },
  } = useOrganContext();

  return (
    <OrganDetailSection
      id={OrganPageIds.hraId}
      title="Human Reference Atlas"
      iconTooltipText="Atlas provided by the Common Coordinate Framework (CCF)."
    >
      <LightThemePaper>
        <CCFOrganInfo uberonIri={uberon} />
      </LightThemePaper>
    </OrganDetailSection>
  );
}

export default withShouldDisplay(HumanReferenceAtlas);
