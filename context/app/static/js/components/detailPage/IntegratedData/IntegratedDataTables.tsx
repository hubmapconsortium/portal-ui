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
      },
    ];
    return entities;
  }, [entityList]);

  const numSelected = useSelectableTableStore((s) => s.selectedRows.size);

  return (
    <EntitiesTables entities={entitiesTableConfig} isSelectable numSelected={numSelected} resetSelectionOnTabChange />
  );
}

export default withSelectableTableProvider(IntegratedDataTables, 'integrated-data');
