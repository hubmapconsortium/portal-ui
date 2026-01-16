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
} from 'js/shared-styles/tables/columns';
import { Copy } from 'js/shared-styles/tables/actions';
import SaveEntitiesButtonFromSearch from 'js/components/savedLists/SaveEntitiesButtonFromSearch';
import WorkspacesDropdownMenu from 'js/components/workspaces/WorkspacesDropdownMenu';
import DownloadsDropdownMenu from 'js/components/downloads/DownloadsDropdownMenu';

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

type IntegratedEntity = 'Donor' | 'Sample' | 'Dataset';

function getHeaderActions(entityType: IntegratedEntity, entityIdsByType: Record<IntegratedEntity, string[]>) {
  return (
    <>
      <SaveEntitiesButtonFromSearch entity_type={entityType} />
      <Copy />
      <WorkspacesDropdownMenu type={entityType} />
      <DownloadsDropdownMenu type={entityType} defaultUUIDs={entityIdsByType[entityType]} />
    </>
  );
}

function IntegratedDataTables({ entities: entityList }: { entities: (Donor | Dataset | Sample)[] }) {
  const entitiesTableConfig: EntitiesTabTypes<Entity>[] = useMemo(() => {
    const entityIdsByType = entityList.reduce<Record<'Donor' | 'Sample' | 'Dataset', string[]>>(
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
        columns: datasetColumns,
        headerActions: getHeaderActions('Dataset', entityIdsByType),
        initialSortState,
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
      },
    ];
    return entities;
  }, [entityList]);

  const numSelected = useSelectableTableStore((s) => s.selectedRows.size);

  return (
    <EntitiesTables
      entities={entitiesTableConfig}
      isSelectable
      numSelected={numSelected}
      resetSelectionOnTabChange
      maxHeight={600}
    />
  );
}

export default withSelectableTableProvider(IntegratedDataTables, 'integrated-data');
