import React, { useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';

import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import { Tab, TabPanel, Tabs } from 'js/shared-styles/tabs';
import SelectableTableProvider, { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';
import { SCFindModalityProvider } from 'js/components/cells/SCFindResults/SCFindModalityContext';
import { SCFindCellTypeQueryDatasetList } from 'js/components/cells/SCFindResults/SCFindCellTypeQueryResults';
import DatasetsOverview from 'js/components/cells/DatasetsOverview';
import { DatasetsForCellType } from 'js/api/scfind/useCellTypeDetailData';
import SCFindDatasetTableActions from 'js/components/cells/SCFindResults/SCFindDatasetTableActions';
import { useCellTypeDatasetsData, useCellTypesDetailPageContext } from './CellTypesDetailPageContext';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import Typography from '@mui/material/Typography';

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
 * A single modality's dataset table. Rendered inside its own SelectableTableProvider (one per tab),
 * so the row selection and the "N selected" + actions header read from — and reset with — that
 * provider when the tab unmounts on switch.
 */
function CellTypeDatasetsTable({
  modality,
  datasetIds,
  countsMap,
}: {
  modality: SCFindModality;
  datasetIds: { hubmap_id: string }[];
  countsMap: Record<string, number>;
}) {
  const numSelected = useSelectableTableStore((state) => state.selectedRows.size);
  return (
    <SCFindModalityProvider value={modality}>
      <SCFindCellTypeQueryDatasetList
        datasetIds={datasetIds}
        countsMap={countsMap}
        numSelected={numSelected}
        headerActions={<SCFindDatasetTableActions />}
      />
    </SCFindModalityProvider>
  );
}

/**
 * Datasets results for the Cell Type detail page. A single RNA/ATAC modality state drives both the
 * datasets overview chart (data-type switch) and the results table (RNAseq/ATACseq tabs); the
 * per-organ distribution charts shown by the shared scFind results component are intentionally
 * omitted here (the Cell Type Distribution section covers that).
 *
 * Each results tab mounts its own SelectableTableProvider, so the dataset selection is scoped to a
 * single modality and resets when switching tabs (matching the rest of the site).
 */
export default function CellTypesDatasetsResults() {
  const { name } = useCellTypesDetailPageContext();
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

  const resultsEffective = showModalitySelection ? resultsModality : pinnedModality;
  const resultsActive = resultsEffective === 'ATAC' ? atac : rna;
  const resultsTabValue = resultsEffective === 'ATAC' ? ATAC_TAB : RNA_TAB;

  const tableLabel = `Datasets with ${name ?? 'cell type'} - scFind Results`;

  return (
    <Stack spacing={2}>
      <SCFindModalityProvider value={overviewEffective}>
        <DatasetsOverview
          datasets={overviewActive.ids}
          tableDescription="This table summarizes the matched datasets and their proportions relative to the scFind-indexed datasets and all HuBMAP datasets."
          dataType={overviewEffective}
          onDataTypeChange={showModalitySelection ? setOverviewModality : undefined}
        >
          These results are derived from RNAseq or ATACseq datasets that were indexed by the <SCFindLink />. Not all
          HuBMAP datasets are currently compatible with this method due to data modalities or the availability of cell
          annotations.
        </DatasetsOverview>
      </SCFindModalityProvider>

      <DetailsAccordion
        summary={<Typography variant="subtitle1">Datasets with {name}</Typography>}
        defaultExpanded
        summaryProps={{ sx: { '.MuiAccordionSummary-content': { mr: 'auto' } } }}
      >
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
              <SelectableTableProvider tableLabel={`${tableLabel} - RNAseq`}>
                <CellTypeDatasetsTable modality={undefined} datasetIds={rna.datasetIds} countsMap={rna.countsMap} />
              </SelectableTableProvider>
            </TabPanel>
            <TabPanel value={resultsTabValue} index={ATAC_TAB} sx={{ mt: 0 }}>
              <SelectableTableProvider tableLabel={`${tableLabel} - ATACseq`}>
                <CellTypeDatasetsTable modality="ATAC" datasetIds={atac.datasetIds} countsMap={atac.countsMap} />
              </SelectableTableProvider>
            </TabPanel>
          </div>
        ) : (
          <SelectableTableProvider tableLabel={tableLabel}>
            <CellTypeDatasetsTable
              modality={pinnedModality}
              datasetIds={resultsActive.datasetIds}
              countsMap={resultsActive.countsMap}
            />
          </SelectableTableProvider>
        )}
      </DetailsAccordion>
    </Stack>
  );
}
