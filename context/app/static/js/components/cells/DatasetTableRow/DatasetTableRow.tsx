import React from 'react';
import { format } from 'date-fns/format';

import { InternalLink } from 'js/shared-styles/Links';
import ExpandableRow from 'js/shared-styles/tables/ExpandableRow';
import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import CellsCharts from 'js/components/cells/CellsCharts';
import useCellsChartLoadingStore, { CellsChartLoadingStore } from 'js/stores/useCellsChartLoadingStore';
import { getOriginSamplesOrgan } from 'js/helpers/functions';
import { CellsResultsDataset, DonorMappedMetadata } from '../types';

const storeSelector = (state: CellsChartLoadingStore) => ({
  loadingUUID: state.loadingUUID,
  fetchedUUIDs: state.fetchedUUIDs,
});

interface UnitValueCellProps {
  unit: string;
  value: string;
}
function UnitValueCell({ unit, value }: UnitValueCellProps) {
  return <ExpandableRowCell>{`${value} ${unit}`}</ExpandableRowCell>;
}

function MetadataCells({ donor: { mapped_metadata } }: Pick<CellsResultsDataset, 'donor'>) {
  if (mapped_metadata) {
    return (
      <>
        {['age', 'body_mass_index'].map((base) => (
          <UnitValueCell
            value={mapped_metadata[`${base}_value` as keyof DonorMappedMetadata] as string}
            unit={mapped_metadata[`${base}_unit` as keyof DonorMappedMetadata] as string}
            key={base}
          />
        ))}
        <ExpandableRowCell>{mapped_metadata.sex}</ExpandableRowCell>
        <ExpandableRowCell>{mapped_metadata.race.join(', ')}</ExpandableRowCell>
      </>
    );
  }

  return (
    <>
      <ExpandableRowCell />
      <ExpandableRowCell />
      <ExpandableRowCell />
      <ExpandableRowCell />
    </>
  );
}

interface DatasetTableRowProps {
  datasetMetadata: CellsResultsDataset;
  numCells: number;
  cellVariableName: string;
  minExpression: number;
  queryType: string;
  isExpandedToStart: boolean;
}

function DatasetTableRow({
  datasetMetadata,
  numCells,
  cellVariableName,
  minExpression,
  queryType,
  isExpandedToStart,
}: DatasetTableRowProps) {
  const { hubmap_id, uuid, mapped_data_types, donor, last_modified_timestamp } = datasetMetadata;

  const { loadingUUID, fetchedUUIDs } = useCellsChartLoadingStore(storeSelector);

  return (
    <ExpandableRow
      numCells={numCells}
      expandedContent={
        <CellsCharts
          uuid={uuid}
          cellVariableName={cellVariableName}
          minExpression={minExpression}
          queryType={queryType}
        />
      }
      disabled={!(fetchedUUIDs.has(uuid) || loadingUUID === uuid || !loadingUUID)}
      disabledTooltipTitle="No additional results can be expanded while detailed data are being retrieved."
      isExpandedToStart={isExpandedToStart}
    >
      <ExpandableRowCell>
        <InternalLink href={`/browse/dataset/${uuid}?marker=${cellVariableName}`} target="_blank">
          {hubmap_id}
        </InternalLink>
      </ExpandableRowCell>
      <ExpandableRowCell>{getOriginSamplesOrgan(datasetMetadata)}</ExpandableRowCell>
      <ExpandableRowCell>{mapped_data_types.join(', ')}</ExpandableRowCell>
      <MetadataCells donor={donor} />
      <ExpandableRowCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</ExpandableRowCell>
    </ExpandableRow>
  );
}

export default DatasetTableRow;
