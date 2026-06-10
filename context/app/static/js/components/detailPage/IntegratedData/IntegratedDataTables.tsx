import React, { useMemo } from 'react';

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

function getHeaderActions(entityType: IntegratedEntityTypes, entityIdsByType: Record<IntegratedEntityTypes, string[]>) {
  return (
    <>
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
}

function IntegratedDataTables({
  entities: entityList,
  tableTooltips,
  isLoading,
  useDefaultQuery = true,
  datasetRetractedSortMap,
}: IntegratedDataTablesProps) {
  const entitiesTableConfig: EntitiesTabTypes<Entity>[] = useMemo(() => {
    const integratedEntityList = entityList.filter(isIntegratedEntity);
    // When the publication contains retracted datasets, surface a status column whose client-side
    // custom sort values place retracted datasets first by default.
    const hasRetracted = Boolean(
      datasetRetractedSortMap && Object.values(datasetRetractedSortMap).some((v) => v === 0),
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
        },
        columns: datasetTabColumns,
        headerActions: getHeaderActions('Dataset', entityIdsByType),
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
  }, [entityList, tableTooltips, datasetRetractedSortMap]);

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
