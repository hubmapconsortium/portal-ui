import React from 'react';

import ScatterPlot from '@mui/icons-material/ScatterPlot';
import Stack from '@mui/material/Stack';

import DetailLayout from 'js/components/detailPage/DetailLayout';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';

import CellTypesProvider from 'js/components/cell-types/CellTypesContext';
import CellTypesVisualization from 'js/components/cell-types/CellTypesVisualization';
import CellTypesSummary from 'js/components/cell-types/CellTypesSummary';
import CellTypesEntitiesTables from 'js/components/cell-types/CellTypesEntitiesTables';
import CellTypesBiomarkersTable from 'js/components/cell-types/CellTypesBiomarkersTable';
import { StyledSvgIcon } from 'js/components/detailPage/entityHeader/EntityHeaderContent/style';
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
        <SummaryTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <StyledSvgIcon component={ScatterPlot} /> Cell Type
          </Stack>
        </SummaryTitle>
        <CellTypesTitle />
        {shouldDisplaySection.summary && <CellTypesSummary />}
        {shouldDisplaySection['distribution-across-organs'] && <CellTypesVisualization />}
        {shouldDisplaySection.biomarkers && <CellTypesBiomarkersTable />}
        {shouldDisplaySection.organs && <CellTypesEntitiesTables />}
      </DetailLayout>
    </CellTypesProvider>
  );
}

export default CellTypes;
