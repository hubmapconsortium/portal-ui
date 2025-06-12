import React from 'react';

import DetailLayout from 'js/components/detailPage/DetailLayout';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';

import CellTypesProvider from 'js/components/cell-types/CellTypesContext';
import CellTypesVisualization from 'js/components/cell-types/CellTypesDistribution';
import CellTypesSummary from 'js/components/cell-types/CellTypesSummary';
import CellTypesEntitiesTables from 'js/components/cell-types/CellTypesEntitiesTables';
import CellTypesBiomarkersTable from 'js/components/cell-types/CellTypesBiomarkersTable';
import CellTypesTitle from 'js/components/cell-types/CellTypesTitle';

interface Props {
  cellId: string;
}

const shouldDisplaySection = {
  summary: true,
  'cell-type-distribution': true,
  biomarkers: true,
  datasets: true,
};

function CellTypes({ cellId }: Props) {
  return (
    <CellTypesProvider cellId={cellId}>
      <DetailLayout sections={shouldDisplaySection}>
        <SummaryTitle entityIcon="CellType">Cell Type</SummaryTitle>
        <CellTypesTitle />
        <CellTypesSummary />
        <CellTypesVisualization shouldDisplay={shouldDisplaySection['cell-type-distribution']} />
        <CellTypesBiomarkersTable shouldDisplay={shouldDisplaySection.biomarkers} />
        <CellTypesEntitiesTables shouldDisplay={shouldDisplaySection.datasets} />
      </DetailLayout>
    </CellTypesProvider>
  );
}

export default CellTypes;
