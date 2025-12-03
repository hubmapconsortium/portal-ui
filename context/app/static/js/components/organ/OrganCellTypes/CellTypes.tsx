import React from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import Description from 'js/shared-styles/sections/Description';
import { useIndexedDatasetsForCurrentOrgan } from 'js/pages/Organ/hooks';
import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import OrganDetailSection from '../OrganDetailSection';
import IndexedDatasetsSummary from './IndexedDatasetsSummary';
import CellTypesTable from './CellTypesTable';

interface CellTypesProps {
  cellTypes: string[];
}

function CellTypes({ cellTypes }: CellTypesProps) {
  const indexedDatasetsInfo = useIndexedDatasetsForCurrentOrgan();
  return (
    <OrganDetailSection title="Cell Types" id="cell-types">
      <Description belowTheFold={<IndexedDatasetsSummary {...indexedDatasetsInfo} />}>
        These results are derived from RNAseq datasets that were indexed by the <SCFindLink /> to identify the cell
        types associated with this organ. Not all HuBMAP datasets are currently compatible with this method due to
        differences in data modalities or the availability of cell annotations. This section gives a summary of the
        datasets that are used to compute these results, and only datasets from this organ are included.
      </Description>
      <CellTypesTable cellTypes={cellTypes} />
    </OrganDetailSection>
  );
}

export default withShouldDisplay(CellTypes);
