import React from 'react';

import DetailLayout from 'js/components/detailPage/DetailLayout';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';

import CellTypesProvider from 'js/components/cell-types/CellTypesContext';
import CellTypesVisualization from 'js/components/cell-types/CellTypeDistribution';
import CellTypesSummary from 'js/components/cell-types/CellTypesSummary';
import CellTypesEntitiesTables from 'js/components/cell-types/CellTypesEntitiesTables';
import CellTypesBiomarkersTable from 'js/components/cell-types/CellTypesBiomarkersTable';
import CellTypesTitle from 'js/components/cell-types/CellTypesTitle';

interface Props {
  cellId: string;
}

const shouldDisplaySection = {
  summary: true,
  'distribution-across-organs': true,
  biomarkers: true,
  organs: true,
};

function CellTypes({ cellId }: Props) {
  return (
    <CellTypesProvider cellId={cellId}>
      <DetailLayout sections={shouldDisplaySection}>
        <SummaryTitle entityIcon="CellType">Cell Type</SummaryTitle>
        <CellTypesTitle />
        <CellTypesSummary />
        {/* {shouldDisplaySection['distribution-across-organs'] && <CellTypesVisualization />} */}
        {/* {shouldDisplaySection.biomarkers && <CellTypesBiomarkersTable />} */}
        {/* {shouldDisplaySection.organs && <CellTypesEntitiesTables />} */}
      </DetailLayout>
    </CellTypesProvider>
  );
}

export default CellTypes;
