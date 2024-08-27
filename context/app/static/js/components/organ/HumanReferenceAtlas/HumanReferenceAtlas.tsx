import React from 'react';

import Paper from '@mui/material/Paper';

import CCFOrganInfo from 'js/components/HRA/CCFOrganInfo';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';

interface HumanReferenceAtlasProps {
  uberonIri: string;
  id: string;
}

function HumanReferenceAtlas({ uberonIri, id }: HumanReferenceAtlasProps) {
  return (
    <CollapsibleDetailPageSection
      id={id}
      title="Human Reference Atlas"
      iconTooltipText="Atlas provided by the Common Coordinate Framework (CCF)."
    >
      <Paper>
        <CCFOrganInfo uberonIri={uberonIri} />
      </Paper>
    </CollapsibleDetailPageSection>
  );
}

export default HumanReferenceAtlas;
