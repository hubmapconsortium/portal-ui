import withShouldDisplay from 'js/helpers/withShouldDisplay';
import React, { ComponentProps, useMemo } from 'react';
import { CellPop } from 'cellpop';
import { CellTypeIcon, DatasetIcon } from 'js/shared-styles/icons';
import Paper from '@mui/material/Paper';
import { ExpandableDiv } from 'js/components/detailPage/visualization/Visualization/style';
import useVisualizationStore, { VisualizationStore } from 'js/stores/useVisualizationStore';
import lightTheme, { darkTheme } from 'js/theme/theme';
import BodyExpandedCSS from 'js/components/detailPage/visualization/BodyExpandedCSS';
import OrganDetailSection from 'js/components/organ/OrganDetailSection';
import { OrganPageIds } from 'js/components/organ/types';
import { CellTypeCountForDataset, useCellTypeCountForDatasets } from 'js/api/scfind/useCellTypeCountForDataset';
import { formatCellTypeName } from 'js/api/scfind/utils';
import { useLabelToCLIDMap } from 'js/api/scfind/useLabelToCLID';
import Skeleton from '@mui/material/Skeleton';
import { useSearchHits } from 'js/hooks/useSearchData';
import { Dataset } from 'js/components/types';
import CellPopDescription from './CellPopDescription';
import CellPopActions from './CellPopActions';
import { useTrackCellpop } from './hooks';

interface CellPopulationPlotProps {
  uuids: string[];
  organ: string;
}

function visualizationSelector(store: VisualizationStore) {
  return {
    fullscreenVizId: store.fullscreenVizId,
    theme: store.vizTheme,
  };
}

const { cellpopId } = OrganPageIds;

type CellPopProps = ComponentProps<typeof CellPop>;
type CellPopData = CellPopProps['data'];

const useCellTypeNames = (data: Record<string, CellTypeCountForDataset[]> | undefined) => {
  // Get all unique cell type names first
  return useMemo(() => {
    if (!data || Object.keys(data).length === 0) {
      return [[], []];
    }

    // Use a set to get all unique cell type names - these include the organ name as a prefix
    const allCellTypesWithOrgan = new Set<string>();
    Object.values(data).forEach((datasetCellTypeCount) => {
      datasetCellTypeCount.forEach(({ index }) => {
        allCellTypesWithOrgan.add(index);
      });
    });
    // Extract cell type names with organ prefix
    const allNamesWithOrgan = Array.from(allCellTypesWithOrgan);
    // Remove the prefix
    const formattedNames = allNamesWithOrgan.map(formatCellTypeName);
    return [allNamesWithOrgan, formattedNames] as const;
  }, [data]);
};

// Helper function to safely extract first value from array or return the value directly
// If the value is missing, return em dash
const getFirstValue = (value: unknown): string | number => {
  if (Array.isArray(value) && value.length > 0) {
    return value[0] as string | number;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  return '—';
};

const getFirstAnatomyValue = (anatomy_1: unknown, anatomy_2: unknown): string | number => {
  const anatomy2 = getFirstValue(anatomy_2);
  if (anatomy2 && anatomy2 !== '—') {
    return anatomy2 as string;
  }
  return getFirstValue(anatomy_1);
};

const useCellPopDataForOrgan = (
  datasets: string[] | undefined = [],
): {
  data: CellPopData | undefined;
  isLoading: boolean;
} => {
  const { data, isLoading: isLoadingDatasetCellCounts } = useCellTypeCountForDatasets({ datasets });

  const { searchHits: datasetMetadata, isLoading: isLoadingDatasetMetadata } = useSearchHits<Dataset>({
    query: {
      ids: {
        values: datasets || [],
      },
    },
    _source: ['hubmap_id', 'title', 'donor.mapped_metadata', 'assay_display_name', 'anatomy_1', 'anatomy_2'],
    size: 10000,
  });

  // Extract unique cell type names
  const [allCellTypeNamesWithOrgans, formattedCellTypeNames] = useCellTypeNames(data);

  // Get cell type to ontology ID mappings
  const { labelToCLIDMap, isLoading: isLoadingCLIDs } = useLabelToCLIDMap(allCellTypeNamesWithOrgans, {
    formatCellTypeNames: true,
  });

  // Format data for CellPop component
  const formattedData = useMemo(() => {
    if (!data || Object.keys(data).length === 0 || !datasetMetadata) {
      return undefined;
    }

    // Create a mapping from UUID to hubmap_id and build row metadata
    const uuidToHubmapId = new Map<string, string>();
    const rowsMetadata: Record<string, Record<string, string | number>> = {};

    datasetMetadata.forEach((dataset) => {
      const { _id: uuid, _source: source } = dataset;
      const { hubmap_id, title, assay_display_name, anatomy_1, anatomy_2, donor } = source;
      // Type assertion to handle the flexible nature of mapped_metadata
      const dmm = donor?.mapped_metadata as Record<string, unknown> | undefined;

      uuidToHubmapId.set(uuid, hubmap_id);

      const metadata: Record<string, string | number> = {
        title,
        assay: getFirstValue(assay_display_name),
        anatomy: getFirstAnatomyValue(anatomy_1, anatomy_2),
        donor_age: getFirstValue(dmm?.age_value),
        donor_sex: getFirstValue(dmm?.sex),
        donor_height: getFirstValue(dmm?.height_value),
        donor_weight: getFirstValue(dmm?.weight_value),
        donor_race: getFirstValue(dmm?.race),
        donor_body_mass_index: getFirstValue(dmm?.body_mass_index_value),
        donor_blood_group: getFirstValue(dmm?.abo_blood_group_system),
        donor_medical_history: getFirstValue(dmm?.medical_history),
        donor_cause_of_death: getFirstValue(dmm?.cause_of_death),
        donor_death_event: getFirstValue(dmm?.death_event),
        donor_mechanism_of_injury: getFirstValue(dmm?.mechanism_of_injury),
      };

      rowsMetadata[hubmap_id] = metadata;
    });

    // Row names are the dataset hubmap_ids (mapped from UUIDs)
    const rowNames = Object.keys(data)
      .map((uuid) => uuidToHubmapId.get(uuid))
      .filter((hubmapId): hubmapId is string => hubmapId !== undefined);

    // Column names are all unique cell type indices across all datasets
    const colNames = formattedCellTypeNames;

    // Counts matrix: array of [dataset hubmap_id, cell type index, count] tuples
    const countsMatrix: [string, string, number][] = [];

    // For each dataset, add entries for all cell types (including zeros for missing ones)
    Object.entries(data).forEach(([datasetUuid, cellTypeCounts]) => {
      const hubmapId = uuidToHubmapId.get(datasetUuid);
      if (!hubmapId) return; // Skip if no hubmap_id found

      // Create a map of existing cell types for this dataset
      const existingCellTypes = new Map<string, number>();
      cellTypeCounts.forEach(({ index, count }) => {
        existingCellTypes.set(formatCellTypeName(index), count);
      });

      // Add entries for all cell types (existing + missing with zero counts)
      colNames.forEach((cellTypeName) => {
        const count = existingCellTypes.get(cellTypeName) ?? 0;
        countsMatrix.push([hubmapId, cellTypeName, count]);
      });
    });

    // Create metadata with cell type ontology IDs
    const colsMetadata: Record<string, Record<string, string | number>> = {};
    colNames.forEach((cellTypeName) => {
      if (Object.keys(labelToCLIDMap).length > 0) {
        const clids = labelToCLIDMap[cellTypeName];
        if (clids && clids.length > 0) {
          colsMetadata[cellTypeName] = {
            'Cell Ontology ID': clids[0], // Use the first CLID if multiple exist
          };
        } else {
          colsMetadata[cellTypeName] = {};
        }
      }
    });

    return {
      rowNames,
      colNames,
      countsMatrixOrder: ['row', 'col', 'value'],
      countsMatrix,
      metadata: {
        cols: colsMetadata,
        rows: rowsMetadata,
      },
    };
  }, [data, formattedCellTypeNames, labelToCLIDMap, datasetMetadata]);

  return {
    data: formattedData,
    isLoading: isLoadingDatasetCellCounts || isLoadingCLIDs || isLoadingDatasetMetadata,
  };
};

const yAxisConfig: CellPopProps['yAxis'] = {
  label: 'Dataset',
  createHref: (row: string) => `https://portal.hubmapconsortium.org/browse/${row}`,
  createSubtitle: (_: string, metadataValues: Record<string, string | number> | undefined) => {
    const assay = metadataValues?.assay;
    const anatomy = metadataValues?.anatomy ?? 'Unknown';
    return `${anatomy} | ${assay}`;
  },
  icon: <DatasetIcon />,
};

const xAxisConfig: CellPopProps['xAxis'] = {
  label: 'Cell Type',
  createHref: (col: string, metadataValues: Record<string, string | number> | undefined) =>
    `https://www.ebi.ac.uk/ols4/search?q=${metadataValues?.['Cell Ontology ID'] ?? col}&ontology=cl`,
  createSubtitle: (_: string, metadataValues: Record<string, string | number> | undefined) => {
    if (metadataValues && 'Cell Ontology Label' in metadataValues) {
      return metadataValues['Cell Ontology Label'] as string;
    }
    return '';
  },
  icon: <CellTypeIcon />,
};

const initialProportions: ComponentProps<typeof CellPop>['initialProportions'] = [
  [0.4, 0.5, 0.1],
  [0.3, 0.6, 0.1],
];

const tooltipFields: ComponentProps<typeof CellPop>['tooltipFields'] = [
  'Cell Ontology ID',
  'title',
  'assay',
  'anatomy',
  'donor_age',
  'donor_sex',
  'donor_race',
];

const disabledControls: ComponentProps<typeof CellPop>['disabledControls'] = ['theme'];

function CellPopSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '16px',
        padding: '16px',
      }}
    >
      {Array.from({ length: 9 }, (_, index) => `skeleton-${Math.random()}-${index}`).map((key) => (
        <Skeleton key={key} variant="rectangular" width="100%" height={300} />
      ))}
    </div>
  );
}

function CellPopulationPlot({ uuids, organ }: CellPopulationPlotProps) {
  const { fullscreenVizId, theme } = useVisualizationStore(visualizationSelector);
  const vizIsFullscreen = fullscreenVizId === cellpopId;

  const trackEvent = useTrackCellpop();

  // Extra "isLoading" workaround is necessary to ensure that all data is loaded before being provided to Cellpop
  const { data, isLoading } = useCellPopDataForOrgan(uuids);

  return (
    <OrganDetailSection title="Cell Population Plot" id={cellpopId} icon={CellTypeIcon}>
      <CellPopDescription organ={organ} />
      <CellPopActions id={cellpopId} />
      <Paper>
        <ExpandableDiv $isExpanded={vizIsFullscreen} $theme={theme} $nonExpandedHeight={1000}>
          {isLoading ? (
            <CellPopSkeleton />
          ) : (
            <CellPop
              data={data}
              theme={theme}
              yAxis={yAxisConfig}
              tooltipFields={tooltipFields}
              xAxis={xAxisConfig}
              initialProportions={initialProportions}
              customTheme={theme === 'dark' ? darkTheme : lightTheme}
              disabledControls={disabledControls}
              trackEvent={trackEvent}
            />
          )}
          <BodyExpandedCSS id={cellpopId} />
        </ExpandableDiv>
      </Paper>
    </OrganDetailSection>
  );
}

export default withShouldDisplay(CellPopulationPlot);
