import React, { useState } from 'react';
import format from 'date-fns/format';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';

import { LightBlueLink } from 'js/shared-styles/Links';

function UnitValueCell({ unit, value }) {
  return <TableCell>{`${value} ${unit}`}</TableCell>;
}

function DatasetTableRow({ datasetMetadata, numCells }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function toggleIsExpanded() {
    setIsExpanded((v) => !v);
  }

  const { hubmap_id, uuid, origin_sample, mapped_data_types, donor, last_modified_timestamp } = datasetMetadata;
  return (
    <>
      <TableRow>
        <TableCell>
          <LightBlueLink href={`/browse/dataset/${uuid}`}>{hubmap_id}</LightBlueLink>
        </TableCell>
        <TableCell>{origin_sample.mapped_organ}</TableCell>
        <TableCell>{mapped_data_types.join(', ')}</TableCell>
        {['age', 'body_mass_index'].map((base) => (
          <UnitValueCell
            value={donor.mapped_metadata[`${base}_value`]}
            unit={donor.mapped_metadata[`${base}_unit`]}
            key={base}
          />
        ))}
        <TableCell>{donor.mapped_metadata.sex}</TableCell>
        <TableCell>{donor.mapped_metadata.race.join(', ')}</TableCell>
        <TableCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
        <TableCell>
          <IconButton onClick={toggleIsExpanded}>
            {isExpanded ? <ArrowDropUpRoundedIcon /> : <ArrowDropDownRoundedIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={numCells} />
        </TableRow>
      )}
    </>
  );
}

export default DatasetTableRow;
