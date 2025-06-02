import React from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import Description from 'js/shared-styles/sections/Description';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import OrganDetailSection from '../OrganDetailSection';
import IndexedDatasetsSummary from './IndexedDatasetsSummary';
import CellTypesTable from './CellTypesTable';

interface CellTypesProps {
  cellTypes: string[];
}

function CellTypes({ cellTypes }: CellTypesProps) {
  return (
    <OrganDetailSection title="Cell Types" id="cell-types">
      <Description belowTheFold={<IndexedDatasetsSummary />}>
        These cell types have been identified in datasets from this organ using the{' '}
        <OutboundIconLink href="https://www.nature.com/articles/s41592-021-01076-9">scFind method</OutboundIconLink>.
      </Description>
      <CellTypesTable cellTypes={cellTypes} />
    </OrganDetailSection>
  );
}

export default withShouldDisplay(CellTypes);
