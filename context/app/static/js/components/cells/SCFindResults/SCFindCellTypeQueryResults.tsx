import React, { forwardRef, useEffect, useMemo } from 'react';
import { Tab, TabPanel, TabProps, Tabs, useTabs } from 'js/shared-styles/tabs';
import { lastModifiedTimestamp, assayTypes, organ, hubmapID } from 'js/shared-styles/tables/columns';
import EntityTable from 'js/shared-styles/tables/EntitiesTable/EntityTable';
import { Dataset, EventInfo } from 'js/components/types';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import SCFindLink from 'js/shared-styles/Links/SCFindLink';
import HelperPanel from 'js/shared-styles/HelperPanel';
import { useInView } from 'react-intersection-observer';
import OrganIcon from 'js/shared-styles/icons/OrganIcon';
import { capitalize } from '@mui/material/utils';
import { extractCellTypeInfo, stringIsCellType } from 'js/api/scfind/utils';
import Box from '@mui/material/Box';
import { CellTypeIcon } from 'js/shared-styles/icons';
import { decimal, percent } from 'js/helpers/number-format';
import Divider from '@mui/material/Divider';
import useSCFindIDAdapter from 'js/api/scfind/useSCFindIDAdapter';
import { useDeduplicatedResults, useSCFindCellTypeResults, useTableTrackingProps } from './hooks';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { SCFindCellTypesChart } from '../CellsCharts/CellTypesChart';
import DatasetListHeader from '../MolecularDataQueryForm/DatasetListHeader';
import CellTypeDistributionChart from '../CellTypeDistributionChart/CellTypeDistributionChart';
import { useResultsProvider } from '../MolecularDataQueryForm/ResultsProvider';
import DatasetsOverview from '../DatasetsOverview';
import { SCFindQueryResultsListProps } from './types';
import { targetCellCountColumn, totalCellCountColumn } from './columns';
import useSCFindResultsStatisticsStore from './store';

const columns = [hubmapID, organ, assayTypes, targetCellCountColumn, totalCellCountColumn, lastModifiedTimestamp];

function SCFindCellTypeQueryDatasetList({ datasetIds }: SCFindQueryResultsListProps) {
  const ids = useSCFindIDAdapter(datasetIds.map(({ hubmap_id }) => hubmap_id));

  return (
    <EntityTable<Dataset>
      maxHeight={800}
      isSelectable
      columns={columns}
      query={{
        query: {
          bool: {
            must: {
              ids: {
                values: ids,
              },
            },
          },
        },
        size: 10000,
        _source: [
          'hubmap_id',
          'origin_samples_unique_mapped_organs',
          'mapped_status',
          'mapped_data_types',
          'mapped_data_access_level',
          'uuid',
          'last_modified_timestamp',
          'entity_type',
        ],
      }}
      expandedContent={SCFindCellTypesChart}
      reverseExpandIndicator
      {...useTableTrackingProps()}
    />
  );
}

interface HelperPanelProps {
  shouldDisplay: boolean;
  currentTissue: string;
}

function ResultsHelperPanel({ shouldDisplay, currentTissue }: HelperPanelProps) {
  const { datasetStats, cellTypeStats } = useSCFindResultsStatisticsStore((state) => ({
    datasetStats: state.datasetStats,
    cellTypeStats: state.cellTypeStats,
  }));
  const cellTypes = useCellVariableNames();

  return (
    <HelperPanel shouldDisplay={shouldDisplay}>
      <HelperPanel.Header gap={1}>
        <OrganIcon organName={currentTissue} />
        {currentTissue && capitalize(currentTissue)}
      </HelperPanel.Header>
      <HelperPanel.BodyItem label="Cell Type Distribution">
        <div>
          This chart shows the distribution of cell types across {currentTissue} for the selected tissue. These results
          are derived from RNAseq datasets that were indexed by the <SCFindLink />.
        </div>
        {/* For some reason, `py: 1` leads to the divider being vertically misaligned; pt:1 and mb: 1 are a workaround */}
        <Divider sx={{ pt: 1, mb: 1 }} />
        <div>
          Targeted cell types are highlighted in the chart, and are a total of {decimal.format(cellTypeStats.targeted)}{' '}
          out of {decimal.format(cellTypeStats.total)} indexed {currentTissue} cells, making up{' '}
          {percent.format(cellTypeStats.targeted / cellTypeStats.total)} of the total cell count.
        </div>
      </HelperPanel.BodyItem>
      <HelperPanel.BodyItem label="Datasets Overview">
        This table provides more details about the {decimal.format(datasetStats.datasets.matched)} matched{' '}
        {currentTissue} datasets containing any of the {decimal.format(cellTypes.length)} requested cell types, and
        their demographics relative to the {decimal.format(datasetStats.datasets.indexed)} datasets indexed in scFind
        and {decimal.format(datasetStats.datasets.total)} total HuBMAP datasets.
      </HelperPanel.BodyItem>
    </HelperPanel>
  );
}

function OrganCellTypeDistributionCharts({ trackingInfo }: { trackingInfo?: EventInfo }) {
  const { openTabIndex, handleTabChange } = useTabs();
  const cellTypes = useCellVariableNames();
  const tissues = useMemo(() => {
    const uniqueTissues = new Set<string>();
    cellTypes.forEach((cellType) => {
      const tissue = cellType.split('.')[0];
      uniqueTissues.add(tissue);
    });
    return Array.from(uniqueTissues);
  }, [cellTypes]);

  const { datasets } = useSCFindCellTypeResults(cellTypes);

  const datasetsByTissue = useMemo(() => {
    const tissueMap: Record<string, string[]> = {};
    tissues.forEach((tissue) => {
      tissueMap[tissue] = [];
    });

    Object.entries(datasets).forEach(([cellType, datasetList]) => {
      const tissue = cellType.split('.')[0];
      if (tissueMap[tissue]) {
        tissueMap[tissue].push(...datasetList.map((dataset) => dataset.hubmap_id));
      }
    });

    return tissueMap;
  }, [datasets, tissues]);

  const [displayHelper, setDisplayHelper] = React.useState(false);

  const currentTissue = tissues[openTabIndex] || tissues[0];

  const { ref: intersectionRef } = useInView({
    threshold: 0.5,
    initialInView: false,
    onChange: (inView) => {
      setDisplayHelper(inView);
    },
  });

  return (
    <div ref={intersectionRef}>
      <Tabs onChange={handleTabChange} value={openTabIndex}>
        {tissues.map((tissue, idx) => (
          <Tab key={tissue} label={tissue} index={idx} />
        ))}
      </Tabs>
      {tissues.map((tissue, idx) => (
        <TabPanel key={tissue} value={openTabIndex} index={idx}>
          <CellTypeDistributionChart tissue={tissue} cellTypes={cellTypes} />
          <Typography variant="subtitle1" component="p">
            Datasets Overview
          </Typography>
          <DatasetsOverview
            datasets={datasetsByTissue[tissue]}
            trackingInfo={trackingInfo}
            tableTabDescription={
              <>
                The table below summarizes the number of matched datasets and the proportions relative to scFind-indexed
                datasets and total HuBMAP datasets.
              </>
            }
          >
            These results are derived from RNAseq datasets that were indexed by the <SCFindLink />. Not all HuBMAP
            datasets are currently compatible with this method due to data modalities or the availability of cell
            annotations.
          </DatasetsOverview>
        </TabPanel>
      ))}
      <ResultsHelperPanel shouldDisplay={displayHelper} currentTissue={currentTissue} />
    </div>
  );
}

interface CellTypeCategoryTabProps extends TabProps {
  cellTypeCategory: string;
  datasetCount: number;
}

const CellTypeCategoryTab = forwardRef(function CellTypeCategoryTab(
  { cellTypeCategory, datasetCount, ...rest }: CellTypeCategoryTabProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { organ: tissue, name, variant } = extractCellTypeInfo(cellTypeCategory);
  const formattedVariant = variant ? ` (${variant})` : '';
  const isCellType = stringIsCellType(cellTypeCategory);
  const label = isCellType ? `${name}${formattedVariant} in ${capitalize(tissue)}` : cellTypeCategory;
  const icon = isCellType ? <OrganIcon organName={tissue} aria-label={tissue} /> : <CellTypeIcon />;

  return (
    <Tab
      ref={ref}
      label={
        <Stack direction="row" alignItems="center" gap={1}>
          <Box flexShrink={0}>{icon}</Box>
          <Box component="span" sx={{ textTransform: 'capitalize' }}>
            {label} ({datasetCount})
          </Box>
        </Stack>
      }
      {...rest}
    />
  );
});

function DatasetListSection() {
  const cellTypes = useCellVariableNames();
  const { datasets, cellTypeCategories, isLoading } = useSCFindCellTypeResults(cellTypes);
  const { openTabIndex, handleTabChange } = useTabs();

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  if (!datasets) {
    return <div>No datasets found</div>;
  }

  return (
    <>
      <DatasetListHeader />
      <Tabs
        variant={cellTypeCategories.length >= 5 ? 'scrollable' : 'fullWidth'}
        onChange={handleTabChange}
        value={openTabIndex}
      >
        {cellTypeCategories.map((cellTypeCategory, idx) => (
          <CellTypeCategoryTab
            cellTypeCategory={cellTypeCategory}
            index={idx}
            datasetCount={datasets[cellTypeCategory]?.length ?? 0}
            key={cellTypeCategory}
          />
        ))}
      </Tabs>
      {cellTypeCategories.map((cellType, idx) => (
        <TabPanel key={cellType} value={openTabIndex} index={idx}>
          <SCFindCellTypeQueryDatasetList key={cellType} datasetIds={datasets[cellType] ?? []} />
        </TabPanel>
      ))}
    </>
  );
}

interface SCFindCellTypeQueryResultsLoaderProps {
  trackingInfo?: EventInfo;
}

function SCFindCellTypeQueryResultsLoader({ trackingInfo }: SCFindCellTypeQueryResultsLoaderProps) {
  const cellTypes = useCellVariableNames();

  const { datasets, isLoading, error } = useSCFindCellTypeResults(cellTypes);
  const { setResults } = useResultsProvider();

  const deduplicatedResults = useDeduplicatedResults(datasets);

  // update the total dataset counter for the results display
  useEffect(() => {
    setResults(deduplicatedResults.length, isLoading, error);
  }, [deduplicatedResults.length, isLoading, error, setResults]);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={800} />;
  }

  if (!datasets) {
    return <div>No datasets found</div>;
  }

  return (
    <Stack spacing={1} py={2}>
      <Typography variant="subtitle1">Cell Type Distribution Across Organs</Typography>
      <OrganCellTypeDistributionCharts trackingInfo={trackingInfo} />
      <DatasetListSection />
    </Stack>
  );
}

export default SCFindCellTypeQueryResultsLoader;
