import React from 'react';
import { format } from 'date-fns/format';

import { InternalLink } from 'js/shared-styles/Links';
import ExpandableRow from 'js/shared-styles/tables/ExpandableRow';
import ExpandableRowCell from 'js/shared-styles/tables/ExpandableRowCell';
import CellsCharts from 'js/components/cells/CellsCharts';
import useCellsChartLoadingStore from 'js/stores/useCellsChartLoadingStore';
import { getOriginSamplesOrgan } from 'js/helpers/functions';

const storeSelector = (state) => ({ loadingUUID: state.loadingUUID, fetchedUUIDs: state.fetchedUUIDs });

function UnitValueCell({ unit, value }) {
  return <ExpandableRowCell>{`${value} ${unit}`}</ExpandableRowCell>;
}

function MetadataCells({ donor: { mapped_metadata } }) {
  if (mapped_metadata) {
    return (
      <>
        {['age', 'body_mass_index'].map((base) => (
          <UnitValueCell value={mapped_metadata[`${base}_value`]} unit={mapped_metadata[`${base}_unit`]} key={base} />
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

function DatasetTableRow({ datasetMetadata, numCells, cellVariableName, minExpression, queryType, isExpandedToStart }) {
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
