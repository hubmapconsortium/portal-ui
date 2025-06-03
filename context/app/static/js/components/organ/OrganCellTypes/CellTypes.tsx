import React from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import Description from 'js/shared-styles/sections/Description';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { useIndexedDatasetsForOrgan } from 'js/pages/Organ/hooks';
import OrganDetailSection from '../OrganDetailSection';
import IndexedDatasetsSummary from './IndexedDatasetsSummary';
import CellTypesTable from './CellTypesTable';

interface CellTypesProps {
  cellTypes: string[];
}

function CellTypes({ cellTypes }: CellTypesProps) {
  const indexedDatasetsInfo = useIndexedDatasetsForOrgan();
  return (
    <OrganDetailSection title="Cell Types" id="cell-types">
      <Description
        belowTheFold={
          <IndexedDatasetsSummary {...indexedDatasetsInfo}>
            These results are derived from RNAseq datasets that were indexed by the{' '}
            <OutboundIconLink href="https://www.nature.com/articles/s41592-021-01076-9">scFind method</OutboundIconLink>{' '}
            to identify the cell types associated with this organ. Not all HuBMAP datasets are currently compatible with
            this method due to differences in data modalities or the availability of cell annotations. This section
            gives a summary of the datasets that are used to compute these results, and only datasets from this organ
            are included.
          </IndexedDatasetsSummary>
        }
      />
      <CellTypesTable cellTypes={cellTypes} />
    </OrganDetailSection>
  );
}

export default withShouldDisplay(CellTypes);
