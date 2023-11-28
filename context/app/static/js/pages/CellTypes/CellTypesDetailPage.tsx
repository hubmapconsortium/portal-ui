import React from 'react';

import DetailLayout from 'js/components/detailPage/DetailLayout';
import SummaryTitle from 'js/components/detailPage/summary/SummaryTitle';

import CellTypesProvider from 'js/components/CellTypesDetail/CellTypesContext';
import PageTitle from 'js/shared-styles/pages/PageTitle';
import CellTypesVisualization from 'js/components/CellTypesDetail/CellTypesVisualization';
import CellTypesSummary from 'js/components/CellTypesDetail/CellTypesSummary';
import CellTypesEntitiesTables from 'js/components/CellTypesDetail/CellTypesEntitiesTables';
import CellTypesBiomarkersTable from 'js/components/CellTypesDetail/CellTypesBiomarkersTable';
import { StyledSvgIcon } from 'js/components/detailPage/entityHeader/EntityHeaderContent/style';
import ScatterPlot from '@mui/icons-material/ScatterPlot';
import Stack from '@mui/material/Stack';

interface Props {
  cellId: string;
}

const shouldDisplaySection = {
  summary: true,
  visualization: true,
  biomarkers: false,
  organs: true,
};

const sectionOrder = Object.entries(shouldDisplaySection)
  .filter(([, shouldDisplay]) => shouldDisplay)
  .map(([sectionName]) => sectionName);

function CellTypes({ cellId }: Props) {
  return (
    <CellTypesProvider cellId={cellId}>
      <DetailLayout sectionOrder={sectionOrder}>
        <SummaryTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <StyledSvgIcon component={ScatterPlot} /> Cell Type
          </Stack>
        </SummaryTitle>
        <PageTitle>{cellId}</PageTitle>
        {shouldDisplaySection.summary && <CellTypesSummary />}
        {shouldDisplaySection.visualization && <CellTypesVisualization />}
        {shouldDisplaySection.biomarkers && <CellTypesBiomarkersTable />}
        {shouldDisplaySection.organs && <CellTypesEntitiesTables />}
      </DetailLayout>
    </CellTypesProvider>
  );
}

export default CellTypes;
