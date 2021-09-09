import React from 'react';
import format from 'date-fns/format';

import { LightBlueLink } from 'js/shared-styles/Links';
import ExpandableRow from 'js/shared-styles/Table/ExpandableRow';
import ExpandableRowCell from 'js/shared-styles/Table/ExpandableRowCell';
import DatasetClusterChart from 'js/components/cells/DatasetClusterChart';
import CellExpressionHistogram from 'js/components/cells/CellExpressionHistogram';

function UnitValueCell({ unit, value }) {
  return <ExpandableRowCell>{`${value} ${unit}`}</ExpandableRowCell>;
}

function DatasetTableRow({ datasetMetadata, numCells, geneName, minGeneExpression }) {
  const { hubmap_id, uuid, origin_sample, mapped_data_types, donor, last_modified_timestamp } = datasetMetadata;
  return (
    <ExpandableRow
      numCells={numCells}
      expandedContent={
        <div>
          <CellExpressionHistogram uuid={uuid} geneName={geneName} />
          <DatasetClusterChart uuid={uuid} geneName={geneName} minGeneExpression={minGeneExpression} />
        </div>
      }
    >
      <ExpandableRowCell>
        <LightBlueLink href={`/browse/dataset/${uuid}`}>{hubmap_id}</LightBlueLink>
      </ExpandableRowCell>
      <ExpandableRowCell>{origin_sample.mapped_organ}</ExpandableRowCell>
      <ExpandableRowCell>{mapped_data_types.join(', ')}</ExpandableRowCell>
      {['age', 'body_mass_index'].map((base) => (
        <UnitValueCell
          value={donor.mapped_metadata[`${base}_value`]}
          unit={donor.mapped_metadata[`${base}_unit`]}
          key={base}
        />
      ))}
      <ExpandableRowCell>{donor.mapped_metadata.sex}</ExpandableRowCell>
      <ExpandableRowCell>{donor.mapped_metadata.race.join(', ')}</ExpandableRowCell>
      <ExpandableRowCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</ExpandableRowCell>
    </ExpandableRow>
  );
}

export default DatasetTableRow;
