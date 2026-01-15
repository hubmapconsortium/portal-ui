import React from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { CollapsibleDetailPageSection } from '../DetailPageSection';
import { Dataset, Donor, Sample } from 'js/components/types';
import IntegratedDataTables from './IntegratedDataTables';

interface IntegratedDatasetsProps {
  entities: (Donor | Dataset | Sample)[];
}

function IntegratedDatasets({ entities }: IntegratedDatasetsProps) {
  return (
    <CollapsibleDetailPageSection id="integrated-data" title="Integrated Data">
      <IntegratedDataTables entities={entities} />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(IntegratedDatasets);
