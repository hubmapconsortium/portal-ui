import React from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { CollapsibleDetailPageSection } from '../detailPage/DetailPageSection';

function CellTypesBiomarkersTable() {
  return (
    <CollapsibleDetailPageSection id="biomarkers" title="Biomarkers">
      Placeholder
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(CellTypesBiomarkersTable);
