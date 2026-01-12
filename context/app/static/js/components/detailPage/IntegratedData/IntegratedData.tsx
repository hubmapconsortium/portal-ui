import React from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { CollapsibleDetailPageSection } from '../DetailPageSection';
import { Dataset, Donor, Sample, isDataset } from 'js/components/types';
import IntegratedDataTabs from './IntegratedDataTabs';

interface IntegratedDatasetsProps {
  entities: (Donor | Dataset | Sample)[];
}

function IntegratedDatasets({ entities }: IntegratedDatasetsProps) {
  return (
    <CollapsibleDetailPageSection id="integrated-datasets" title="Integrated Data">
      <IntegratedDataTabs entities={entities} />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(IntegratedDatasets);
