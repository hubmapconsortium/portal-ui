import React, { useState } from 'react';
import format from 'date-fns/format';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';

import { LightBlueLink } from 'js/shared-styles/Links';
import { StyledTableCell } from './style';

function UnitValueCell({ unit, value, isExpanded }) {
  return <StyledTableCell $removeBorder={isExpanded}>{`${value} ${unit}`}</StyledTableCell>;
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
        <StyledTableCell $removeBorder={isExpanded}>
          <LightBlueLink href={`/browse/dataset/${uuid}`}>{hubmap_id}</LightBlueLink>
        </StyledTableCell>
        <StyledTableCell $removeBorder={isExpanded}>{origin_sample.mapped_organ}</StyledTableCell>
        <StyledTableCell $removeBorder={isExpanded}>{mapped_data_types.join(', ')}</StyledTableCell>
        {['age', 'body_mass_index'].map((base) => (
          <UnitValueCell
            value={donor.mapped_metadata[`${base}_value`]}
            unit={donor.mapped_metadata[`${base}_unit`]}
            key={base}
            isExpanded={isExpanded}
          />
        ))}
        <StyledTableCell $removeBorder={isExpanded}>{donor.mapped_metadata.sex}</StyledTableCell>
        <StyledTableCell $removeBorder={isExpanded}>{donor.mapped_metadata.race.join(', ')}</StyledTableCell>
        <StyledTableCell $removeBorder={isExpanded}>{format(last_modified_timestamp, 'yyyy-MM-dd')}</StyledTableCell>
        <StyledTableCell $removeBorder={isExpanded}>
          <IconButton onClick={toggleIsExpanded}>
            {isExpanded ? <ArrowDropUpRoundedIcon /> : <ArrowDropDownRoundedIcon />}
          </IconButton>
        </StyledTableCell>
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
