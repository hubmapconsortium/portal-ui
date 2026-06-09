import React, { useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';

import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import { Tab, TabPanel, Tabs } from 'js/shared-styles/tabs';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';
import { SCFindModalityProvider } from 'js/components/cells/SCFindResults/SCFindModalityContext';
import { SCFindCellTypeQueryDatasetList } from 'js/components/cells/SCFindResults/SCFindCellTypeQueryResults';
import DatasetsOverview from 'js/components/cells/DatasetsOverview';
import { DatasetsForCellType } from 'js/api/scfind/useCellTypeDetailData';
import { useCellTypeDatasetsData } from './CellTypesDetailPageContext';
import CellTypesDatasetTableActions from './CellTypesDatasetTableActions';

const RNA_TAB = 0;
const ATAC_TAB = 1;

/**
 * Collapses the per-cell-type aggregate datasets into a unique matched-dataset id list + a
 * hubmap_id -> target-cell-count map for the table's target-cell-count column.
 */
function useMatchedDatasets(datasetsForCellTypes: Record<string, DatasetsForCellType>) {
  return useMemo(() => {
    const countsMap: Record<string, number> = {};
    Object.values(datasetsForCellTypes).forEach(({ counts, datasets }) => {
      datasets.forEach((dataset, index) => {
        countsMap[dataset] = (countsMap[dataset] ?? 0) + (counts[index] ?? 0);
      });
    });
    const ids = Object.keys(countsMap);
    return { ids, countsMap, datasetIds: ids.map((hubmap_id) => ({ hubmap_id })) };
  }, [datasetsForCellTypes]);
}

/**
 * Datasets results for the Cell Type detail page. A single RNA/ATAC modality state drives both the
 * datasets overview chart (data-type switch) and the results table (RNAseq/ATACseq tabs); the
 * per-organ distribution charts shown by the shared scFind results component are intentionally
 * omitted here (the Cell Type Distribution section covers that).
 */
export default function CellTypesDatasetsResults() {
  const { selectedRows } = useSelectableTableStore();
  const numSelected = selectedRows.size;

  const { datasetsForCellTypes: rnaDatasets } = useCellTypeDatasetsData(undefined);
  const { datasetsForCellTypes: atacDatasets } = useCellTypeDatasetsData('ATAC');

  const rna = useMatchedDatasets(rnaDatasets);
  const atac = useMatchedDatasets(atacDatasets);
  const hasRna = rna.ids.length > 0;
  const hasAtac = atac.ids.length > 0;
  // Modality controls (the overview's switch/tabs and the results-list tabs) only make sense, and
  // only appear, when both modalities have datasets; otherwise we show the one available modality.
  const showModalitySelection = hasRna && hasAtac;
  // When only one modality has data, pin to it.
  const pinnedModality: SCFindModality = hasAtac && !hasRna ? 'ATAC' : undefined;

  // The datasets overview (chart switch <-> summary-table tabs) and the results-list table tabs are
  // independent: each tracks its own modality so the user can, e.g., browse RNA results while the
  // overview shows ATAC.
  const [overviewModality, setOverviewModality] = useState<SCFindModality>(undefined);
  const [resultsModality, setResultsModality] = useState<SCFindModality>(undefined);

  const overviewEffective = showModalitySelection ? overviewModality : pinnedModality;
  const overviewActive = overviewEffective === 'ATAC' ? atac : rna;
  const overviewModalityLabel = overviewEffective === 'ATAC' ? 'ATACseq' : 'RNAseq';

  const resultsEffective = showModalitySelection ? resultsModality : pinnedModality;
  const resultsActive = resultsEffective === 'ATAC' ? atac : rna;
  const resultsTabValue = resultsEffective === 'ATAC' ? ATAC_TAB : RNA_TAB;

  const headerActions = <CellTypesDatasetTableActions />;

  return (
    <Stack spacing={2}>
      <SCFindModalityProvider value={overviewEffective}>
        <DatasetsOverview
          datasets={overviewActive.ids}
          tableDescription="This table summarizes the matched datasets and their proportions relative to the scFind-indexed datasets and all HuBMAP datasets."
          dataType={overviewEffective}
          onDataTypeChange={showModalitySelection ? setOverviewModality : undefined}
        >
          These results are derived from {overviewModalityLabel} datasets that were indexed by the <SCFindLink />. Not
          all HuBMAP datasets are currently compatible with this method due to data modalities or the availability of
          cell annotations.
        </DatasetsOverview>
      </SCFindModalityProvider>
      {showModalitySelection ? (
        <div>
          <Tabs
            value={resultsTabValue}
            onChange={(_event, value: number) => setResultsModality(value === ATAC_TAB ? 'ATAC' : undefined)}
          >
            <Tab label={`RNAseq (${rna.ids.length})`} index={RNA_TAB} />
            <Tab label={`ATACseq (${atac.ids.length})`} index={ATAC_TAB} />
          </Tabs>
          <TabPanel value={resultsTabValue} index={RNA_TAB} sx={{ mt: 0 }}>
            <SCFindModalityProvider value={undefined}>
              <SCFindCellTypeQueryDatasetList
                datasetIds={rna.datasetIds}
                countsMap={rna.countsMap}
                numSelected={numSelected}
                headerActions={headerActions}
              />
            </SCFindModalityProvider>
          </TabPanel>
          <TabPanel value={resultsTabValue} index={ATAC_TAB} sx={{ mt: 0 }}>
            <SCFindModalityProvider value="ATAC">
              <SCFindCellTypeQueryDatasetList
                datasetIds={atac.datasetIds}
                countsMap={atac.countsMap}
                numSelected={numSelected}
                headerActions={headerActions}
              />
            </SCFindModalityProvider>
          </TabPanel>
        </div>
      ) : (
        <SCFindModalityProvider value={pinnedModality}>
          <SCFindCellTypeQueryDatasetList
            datasetIds={resultsActive.datasetIds}
            countsMap={resultsActive.countsMap}
            numSelected={numSelected}
            headerActions={headerActions}
          />
        </SCFindModalityProvider>
      )}
    </Stack>
  );
}
