import React from 'react';

import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import { formatCellTypeName } from 'js/api/scfind/utils';
import CellTypesLandingDataProvider, {
  useCellTypesLandingDataContext,
} from 'js/components/cell-types-landing/CellTypesLandingDataContext';
import CellTypesSearchProvider from 'js/components/cell-types-landing/CellTypesSearchContext';
import CellTypesPanelList from 'js/components/cell-types-landing/CellTypesPanelList';
import CellTypesSearchBar from 'js/components/cell-types-landing/CellTypesSearchBar';
import MultiOrganCellTypeDistributionChartWithProvider from 'js/components/cell-types/CellTypesDistribution/MultiOrganCellTypesDistributionChart';
import RelevantPagesSection from 'js/shared-styles/sections/RelevantPagesSection';
import { trackEvent } from 'js/helpers/trackers';
import { CellTypeIcon } from 'js/shared-styles/icons';

function CellTypesLandingPageContent() {
  const { cellTypeNames, cellTypeNamesAtac, organs: cellTypeOrgans } = useCellTypesLandingDataContext();

  const uniqueCellTypes = new Set([...cellTypeNames, ...cellTypeNamesAtac].map(formatCellTypeName)).size;

  return (
    <CellTypesSearchProvider
      initialState={{
        organs: cellTypeOrgans,
      }}
    >
      <PanelListLandingPage
        title={
          <>
            <CellTypeIcon color="primary" fontSize="inherit" /> Cell Types
          </>
        }
        subtitle={`${uniqueCellTypes} Cell Types Total`}
        noIcon
        description={
          <>
            Explore annotated cell types across HuBMAP datasets, with insights into their anatomical distribution and
            associated biomarkers. Visualize and compare cell type distribution across organs using interactive plots,
            and find datasets relevant to the cell type.
            <RelevantPagesSection
              pages={[
                {
                  link: '/search/biomarkers-cell-types',
                  children: 'Biomarker and Cell Type Search',
                  external: false,
                  onClick: () => {
                    trackEvent({
                      action: 'Select Relevant Page button',
                      label: 'Molecular & Cellular Data Query',
                      category: 'Cell Types Landing Page',
                    });
                  },
                },
              ]}
            />
          </>
        }
        data-testid="cell-types-title"
      >
        {cellTypeNames.length > 0 && cellTypeOrgans.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <MultiOrganCellTypeDistributionChartWithProvider
              cellTypes={cellTypeNames}
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

export default function CellTypesLandingPage() {
  return (
    <CellTypesLandingDataProvider>
      <CellTypesLandingPageContent />
    </CellTypesLandingDataProvider>
  );
}
