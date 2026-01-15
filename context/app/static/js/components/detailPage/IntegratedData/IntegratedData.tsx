import React from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { CollapsibleDetailPageSection } from '../DetailPageSection';
import { Dataset, Donor, Sample } from 'js/components/types';
import IntegratedDataTabs from './IntegratedDataTabs';

interface IntegratedDatasetsProps {
  entities: (Donor | Dataset | Sample)[];
}

function IntegratedDatasets({ entities }: IntegratedDatasetsProps) {
  return (
    <CollapsibleDetailPageSection id="integrated-data" title="Integrated Data">
      <IntegratedDataTabs entities={entities} />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(IntegratedDatasets);
