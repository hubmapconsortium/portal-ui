import React, { useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import DetailsAccordion from 'js/shared-styles/accordions/DetailsAccordion';
import { Tab, TabPanel, Tabs } from 'js/shared-styles/tabs';
import { SCFindModality } from 'js/components/cells/MolecularDataQueryForm/types';
import { SCFindModalityProvider } from 'js/components/cells/SCFindResults/SCFindModalityContext';
import { CurrentGeneContextProvider } from 'js/components/cells/SCFindResults/CurrentGeneContext';
import { GeneCountsContextProvider } from 'js/components/cells/SCFindResults/GeneCountsContext';
import { SCFindGeneQueryDatasetList } from 'js/components/cells/SCFindResults/SCFindGeneQueryResults';
import SCFindDatasetTableActions from 'js/components/cells/SCFindResults/SCFindDatasetTableActions';
import DatasetsOverview from 'js/components/cells/DatasetsOverview';
import ViewIndexedDatasetsButton from 'js/components/organ/OrganCellTypes/ViewIndexedDatasetsButton';
import SelectableTableProvider, { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { DatasetsForGenesResponse } from 'js/api/scfind/useFindDatasetForGenes';
import { useGeneDatasetsData, useGeneSymbol } from '../hooks';

const RNA_TAB = 0;
const ATAC_TAB = 1;

/**
 * Collapse a `findDatasets` aggregate slice into the matched-dataset id list + a hubmap_id -> count
 * map for the table's matching-gene column. The gene-detail aggregate queries a single gene, so we
 * read the one entry regardless of the exact key casing scFind echoes back.
 */
function useGeneMatchedDatasets(data: DatasetsForGenesResponse | undefined) {
  return useMemo(() => {
    const findDatasets = data?.findDatasets ?? {};
    const allCounts = data?.counts ?? {};
    const key = Object.keys(findDatasets)[0];
    const datasets = key ? findDatasets[key] : [];
    const counts = key ? (allCounts[key] ?? []) : [];

    const countsMap: Record<string, number> = {};
    datasets.forEach((hubmapId, index) => {
      if (hubmapId) {
        countsMap[hubmapId] = counts[index] ?? 0;
      }
    });
    const ids = Object.keys(countsMap);
    return { ids, countsMap, datasetIds: ids.map((hubmap_id) => ({ hubmap_id })) };
  }, [data]);
}

/**
 * A single modality's dataset table. Rendered inside its own SelectableTableProvider (one per tab),
 * so the row selection and the "N selected" + actions header read from — and reset with — that
 * provider when the tab unmounts on switch.
 */
function GeneDatasetsTable({
  modality,
  geneSymbol,
  datasetIds,
  countsMap,
}: {
  modality: SCFindModality;
  geneSymbol: string;
  datasetIds: { hubmap_id: string }[];
  countsMap: Record<string, number>;
}) {
  const numSelected = useSelectableTableStore((state) => state.selectedRows.size);
  // The matching-gene % column reads the gene's per-dataset cell counts from GeneCountsContext
  // (keyed by gene -> hubmap_id). Provide it from the aggregate's counts for this modality so the
  // percentage isn't always 0 (the shared SCFindGeneQueryResultsLoader supplies this on the Cells
  // query page, but this detail-page table renders the list directly).
  const geneCounts = useMemo(() => ({ [geneSymbol]: countsMap }), [geneSymbol, countsMap]);
  return (
    <SCFindModalityProvider value={modality}>
      <CurrentGeneContextProvider value={geneSymbol}>
        <GeneCountsContextProvider value={geneCounts}>
          <SCFindGeneQueryDatasetList
            datasetIds={datasetIds}
            countsMap={countsMap}
            numSelected={numSelected}
            headerActions={<SCFindDatasetTableActions />}
          />
        </GeneCountsContextProvider>
      </CurrentGeneContextProvider>
    </SCFindModalityProvider>
  );
}

/**
 * Datasets results for the Gene detail page. A single RNA/ATAC modality state drives the datasets
 * overview chart (data-type switch) + its summary-table tabs, and an independent state drives the
 * results-list RNAseq/ATACseq tabs — mirroring the Cell Type detail page so ATAC datasets are
 * surfaced. Both modality controls only appear when both modalities have datasets.
 *
 * Each results tab mounts its own SelectableTableProvider, so the dataset selection is scoped to a
 * single modality and resets when switching tabs. Must be rendered inside the gene detail page's
 * MolecularDataQueryForm providers (the reused dataset list + its expanded charts depend on that).
 */
export default function GeneDatasetsResults() {
  const geneSymbol = useGeneSymbol();

  const { data: rnaData } = useGeneDatasetsData(undefined);
  const { data: atacData } = useGeneDatasetsData('ATAC');

  const rna = useGeneMatchedDatasets(rnaData);
  const atac = useGeneMatchedDatasets(atacData);
  const hasRna = rna.ids.length > 0;
  const hasAtac = atac.ids.length > 0;
  // The modality controls only make sense, and only appear, when both modalities have datasets.
  const showModalitySelection = hasRna && hasAtac;
  // When only one modality has data, pin to it.
  const pinnedModality: SCFindModality = hasAtac && !hasRna ? 'ATAC' : undefined;

  // The overview (chart switch <-> summary-table tabs) and the results-list tabs are independent:
  // each tracks its own modality so the user can browse one modality's results while the overview
  // shows the other.
  const [overviewModality, setOverviewModality] = useState<SCFindModality>(undefined);
  const [resultsModality, setResultsModality] = useState<SCFindModality>(undefined);

  const overviewEffective = showModalitySelection ? overviewModality : pinnedModality;
  const overviewActive = overviewEffective === 'ATAC' ? atac : rna;
  const overviewModalityLabel = overviewEffective === 'ATAC' ? 'ATACseq' : 'RNAseq';

  const resultsEffective = showModalitySelection ? resultsModality : pinnedModality;
  const resultsActive = resultsEffective === 'ATAC' ? atac : rna;
  const resultsTabValue = resultsEffective === 'ATAC' ? ATAC_TAB : RNA_TAB;

  const tableLabel = `Datasets with ${geneSymbol} - scFind Results`;

  return (
    <Stack spacing={2}>
      <SCFindModalityProvider value={overviewEffective}>
        <DatasetsOverview
          datasets={overviewActive.ids}
          dataType={overviewEffective}
          onDataTypeChange={showModalitySelection ? setOverviewModality : undefined}
          belowTheFold={<ViewIndexedDatasetsButton scFindParams={{ scFindOnly: true }} isLoading={false} />}
        >
          This overview summarizes the matched {overviewModalityLabel} datasets and their proportions relative to both
          the scFind-indexed datasets and all HuBMAP datasets, as identified by the <SCFindLink />. The summary is
          available as a visualization (downloadable as a PNG) and as a table (downloadable as a TSV).
        </DatasetsOverview>
      </SCFindModalityProvider>
      <DetailsAccordion
        summary={<Typography variant="subtitle1">Datasets with {geneSymbol}</Typography>}
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
                <GeneDatasetsTable
                  modality={undefined}
                  geneSymbol={geneSymbol}
                  datasetIds={rna.datasetIds}
                  countsMap={rna.countsMap}
                />
              </SelectableTableProvider>
            </TabPanel>
            <TabPanel value={resultsTabValue} index={ATAC_TAB} sx={{ mt: 0 }}>
              <SelectableTableProvider tableLabel={`${tableLabel} - ATACseq`}>
                <GeneDatasetsTable
                  modality="ATAC"
                  geneSymbol={geneSymbol}
                  datasetIds={atac.datasetIds}
                  countsMap={atac.countsMap}
                />
              </SelectableTableProvider>
            </TabPanel>
          </div>
        ) : (
          <SelectableTableProvider tableLabel={tableLabel}>
            <GeneDatasetsTable
              modality={pinnedModality}
              geneSymbol={geneSymbol}
              datasetIds={resultsActive.datasetIds}
              countsMap={resultsActive.countsMap}
            />
          </SelectableTableProvider>
        )}
      </DetailsAccordion>
    </Stack>
  );
}
