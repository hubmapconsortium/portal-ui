import React from 'react';

import Paper from '@mui/material/Paper';

import CCFOrganInfo from 'js/components/HRA/CCFOrganInfo';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { useOrganContext } from 'js/components/organ/contexts';
import { OrganPageIds } from 'js/components/organ/types';

function HumanReferenceAtlas() {
  const {
    organ: { uberon },
  } = useOrganContext();

  return (
    <CollapsibleDetailPageSection
      id={OrganPageIds.humanReferenceAtlasId}
      title="Human Reference Atlas"
      iconTooltipText="Atlas provided by the Common Coordinate Framework (CCF)."
    >
      <Paper>
        <CCFOrganInfo uberonIri={uberon} />
      </Paper>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(HumanReferenceAtlas);
