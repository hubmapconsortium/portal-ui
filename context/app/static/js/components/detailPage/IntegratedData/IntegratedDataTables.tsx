import React, { useMemo, useState } from 'react';

import LabeledPrimarySwitch from 'js/shared-styles/switches/LabeledPrimarySwitch';
import { Dataset, Donor, Entity, Sample } from 'js/components/types';
import EntitiesTables from 'js/shared-styles/tables/EntitiesTable/EntitiesTables';
import { EntitiesTabTypes } from 'js/shared-styles/tables/EntitiesTable/types';
import { useSelectableTableStore, withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
import {
  hubmapID,
  assayTypes,
  organCol,
  donorAge,
  donorBMI,
  donorSex,
  donorRace,
  createdTimestamp,
  parentDonorRace,
  parentDonorSex,
  parentDonorAge,
  anatomy,
  status as statusColumn,
} from 'js/shared-styles/tables/columns';
import { Copy } from 'js/shared-styles/tables/actions';
import SaveEntitiesButtonFromSearch from 'js/components/savedLists/SaveEntitiesButtonFromSearch';
import WorkspacesDropdownMenu from 'js/components/workspaces/WorkspacesDropdownMenu';
import DownloadsDropdownMenu from 'js/components/data-transfer/DownloadsDropdownMenu';

const datasetColumns = [
  hubmapID,
  assayTypes,
  organCol,
  parentDonorAge,
  parentDonorRace,
  parentDonorSex,
  createdTimestamp,
];
const donorColumns = [hubmapID, donorAge, donorSex, donorBMI, donorRace, createdTimestamp];
const sampleColumns = [hubmapID, organCol, anatomy, parentDonorAge, parentDonorRace, parentDonorSex, createdTimestamp];

// Sorting by creation date ensures the current entity is at the top of its table if present
const initialSortState = { columnId: createdTimestamp.id, direction: 'desc' } as const;

type IntegratedEntityTypes = 'Donor' | 'Sample' | 'Dataset';
type IntegratedEntity = Donor | Sample | Dataset;

const isIntegratedEntity = (e: Entity): e is IntegratedEntity => {
  return ['Donor', 'Sample', 'Dataset'].includes(e.entity_type);
};

/**
 * Datasets to show in the Dataset tab: all of them when no direct set is provided or the
 * ancestor-datasets toggle is enabled, otherwise only the directly-integrated datasets.
 */
export function getDisplayedDatasetIds(
  allDatasetIds: string[],
  directDatasetIds: Set<string> | undefined,
  showAncestorDatasets: boolean,
): string[] {
  if (!directDatasetIds || showAncestorDatasets) {
    return allDatasetIds;
  }
  return allDatasetIds.filter((id) => directDatasetIds.has(id));
}

function getHeaderActions(
  entityType: IntegratedEntityTypes,
  entityIdsByType: Record<IntegratedEntityTypes, string[]>,
  extraActions?: React.ReactNode,
) {
  return (
    <>
      {extraActions}
      <SaveEntitiesButtonFromSearch entity_type={entityType} />
      <Copy />
      <WorkspacesDropdownMenu type={entityType} />
      <DownloadsDropdownMenu type={entityType} defaultUUIDs={entityIdsByType[entityType]} />
    </>
  );
}

interface IntegratedDataTablesProps {
  entities: Entity[];
  tableTooltips?: Partial<Record<IntegratedEntityTypes, string>>;
  isLoading?: boolean;
  /**
   * Whether queries built by this table should apply the default-query restriction
   * (which excludes documents with `next_revision_uuid` or `sub_status`). Defaults
   * to true for compatibility with general detail-page surfaces. Publications pass
   * `false` because they reference specific older dataset versions.
   */
  useDefaultQuery?: boolean;
  /**
   * Optional map of dataset ES doc _id → retracted-first sort value (retracted = 0, others = 1).
   * When it contains any retracted datasets, the Dataset tab gains a status column that sorts
   * retracted datasets to the top by default (overridable by clicking another column header).
   */
  datasetRetractedSortMap?: Record<string, number>;
  /**
   * UUIDs of the datasets directly integrated into the entity being viewed. These are always shown
   * in the Dataset tab; any other datasets in `entities` are treated as ancestor datasets and are
   * hidden behind a "Show ancestor datasets" toggle. When omitted, every dataset is shown.
   */
  directDatasetIds?: Set<string>;
}

function IntegratedDataTables({
  entities: entityList,
  tableTooltips,
  isLoading,
  useDefaultQuery = true,
  datasetRetractedSortMap,
  directDatasetIds,
}: IntegratedDataTablesProps) {
  const [showAncestorDatasets, setShowAncestorDatasets] = useState(false);

  const entitiesTableConfig: EntitiesTabTypes<Entity>[] = useMemo(() => {
    const integratedEntityList = entityList.filter(isIntegratedEntity);
    const allDatasetIds = integratedEntityList.filter((e) => e.entity_type === 'Dataset').map((e) => e.uuid);
    const ancestorDatasetsPresent = Boolean(directDatasetIds) && allDatasetIds.some((id) => !directDatasetIds!.has(id));
    const displayedDatasetIds = getDisplayedDatasetIds(allDatasetIds, directDatasetIds, showAncestorDatasets);
    // Toggle (rendered in the Dataset tab's header actions) to reveal the ancestor datasets of the
    // directly-integrated datasets. Only shown when there are ancestor datasets to reveal.
    const ancestorDatasetsToggle = ancestorDatasetsPresent ? (
      <LabeledPrimarySwitch
        checked={showAncestorDatasets}
        onChange={(_, checked) => setShowAncestorDatasets(checked)}
        disabledLabel="Show Associated"
        enabledLabel="Show All Ancestors"
        ariaLabel="Show ancestor datasets"
        noWrapOptionLabels
        disabledTooltip="Show only the datasets directly associated with this entity."
        enabledTooltip="Also show the ancestor datasets these were derived from, such as the raw datasets they were processed from."
      />
    ) : null;
    // Only surface the retracted-first status column when a retracted dataset is actually visible.
    const hasRetracted = Boolean(
      datasetRetractedSortMap && displayedDatasetIds.some((id) => datasetRetractedSortMap[id] === 0),
    );
    const datasetTabColumns = hasRetracted
      ? [
          hubmapID,
          { ...statusColumn, sort: undefined, customSortValues: datasetRetractedSortMap },
          assayTypes,
          organCol,
          parentDonorAge,
          parentDonorRace,
          parentDonorSex,
          createdTimestamp,
        ]
      : datasetColumns;
    const datasetInitialSortState = hasRetracted
      ? ({ columnId: 'mapped_status', direction: 'asc' } as const)
      : initialSortState;

    const entityIdsByType = integratedEntityList.reduce<Record<IntegratedEntityTypes, string[]>>(
      (acc, curr) => {
        acc[curr.entity_type].push(curr.uuid);
        return acc;
      },
      {
        Donor: [],
        Sample: [],
        Dataset: [],
      },
    );
    // Restrict the Dataset tab (query, counts, and download/save defaults) to the datasets currently
    // displayed. Sample/Donor tabs already only contain sample/donor ancestors.
    entityIdsByType.Dataset = displayedDatasetIds;
    const entities: EntitiesTabTypes<Entity>[] = [
      {
        entityType: 'Dataset',
        query: {
          query: {
            bool: {
              must: {
                ids: {
                  values: entityIdsByType.Dataset,
                },
              },
            },
          },
          // Retracted-first sorting is client-side (fetches all rows at once, no scroll pagination),
          // so request a large size to load every dataset.
          ...(hasRetracted && { size: 10000 }),
        },
        columns: datasetTabColumns,
        headerActions: getHeaderActions('Dataset', entityIdsByType, ancestorDatasetsToggle),
        initialSortState: datasetInitialSortState,
        tabTooltipText: tableTooltips?.Dataset,
      },
      {
        entityType: 'Sample',
        query: {
          query: {
            bool: {
              must: {
                ids: {
                  values: entityIdsByType.Sample,
                },
              },
            },
          },
        },
        columns: sampleColumns,
        headerActions: getHeaderActions('Sample', entityIdsByType),
        initialSortState,
        tabTooltipText: tableTooltips?.Sample,
      },
      {
        entityType: 'Donor',
        query: {
          query: {
            bool: {
              must: {
                ids: {
                  values: entityIdsByType.Donor,
                },
              },
            },
          },
        },
        columns: donorColumns,
        headerActions: getHeaderActions('Donor', entityIdsByType),
        initialSortState,
        tabTooltipText: tableTooltips?.Donor,
      },
    ];
    return entities;
  }, [entityList, tableTooltips, datasetRetractedSortMap, directDatasetIds, showAncestorDatasets]);

  const numSelected = useSelectableTableStore((s) => s.selectedRows.size);

  return (
    <EntitiesTables
      entities={entitiesTableConfig}
      isSelectable
      numSelected={numSelected}
      resetSelectionOnTabChange
      maxHeight={600}
      isLoading={isLoading}
      useDefaultQuery={useDefaultQuery}
    />
  );
}

export default withSelectableTableProvider(IntegratedDataTables, 'integrated-data');
