import React from 'react';

import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import useCellTypeNames, { useCellTypeNamesMap, useCellTypeOrgans } from 'js/api/scfind/useCellTypeNames';
import CellTypesSearchProvider from 'js/components/cell-types-landing/CellTypesSearchContext';
import CellTypesPanelList from 'js/components/cell-types-landing/CellTypesPanelList';
import CellTypesSearchBar from 'js/components/cell-types-landing/CellTypesSearchBar';
import MultiOrganCellTypeDistributionChartWithProvider from 'js/components/cell-types/CellTypesDistribution/MultiOrganCellTypesDistributionChart';

export default function CellTypesLandingPage() {
  const cellTypesMap = useCellTypeNamesMap();
  const { data } = useCellTypeNames();
  const cellTypeOrgans = useCellTypeOrgans();

  const uniqueCellTypes = Object.keys(cellTypesMap).length;

  return (
    <CellTypesSearchProvider
      initialState={{
        organs: cellTypeOrgans,
      }}
    >
      <PanelListLandingPage
        title="Cell Types"
        subtitle={`${uniqueCellTypes} Cell Types`}
        noIcon
        description={
          <>
            Explore annotated cell types across HuBMAP datasets, with insights into their anatomical distribution and
            associated biomarkers. Visualize and compare cell type distribution across organs using interactive plots,
            and find datasets relevant to the cell type.
          </>
        }
        data-testid="cell-types-title"
      >
        {data?.cellTypeNames && cellTypeOrgans && (
          <div style={{ marginBottom: '1rem' }}>
            <MultiOrganCellTypeDistributionChartWithProvider
              cellTypes={data?.cellTypeNames}
              organs={cellTypeOrgans}
              hideLegend
            />
          </div>
        )}
        <CellTypesSearchBar />
        <CellTypesPanelList />
      </PanelListLandingPage>
    </CellTypesSearchProvider>
  );
}
