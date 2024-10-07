import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import IconTooltipCell from 'js/shared-styles/tables/IconTooltipCell';
import DonorAgeTooltip from 'js/shared-styles/tooltips/DonorAgeTooltip';
import { defaultColumns } from '../MetadataSection/columns';

interface MetadataTableRow {
  key: string;
  value: string;
  description?: string;
}

function MetadataTable({ tableRows = [] as MetadataTableRow[], columns = defaultColumns }) {
  return (
    <Paper sx={{ width: '100%' }}>
      <StyledTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <HeaderCell key={column.id}>{column.label}</HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map((row) => (
              <TableRow key={row.key}>
                <IconTooltipCell tooltipTitle={row?.description}>{row.key}</IconTooltipCell>
                <TableCell>
                  {row.key.endsWith('age_value') ? (
                    <DonorAgeTooltip donorAge={row.value}>{row.value}</DonorAgeTooltip>
                  ) : (
                    row.value
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
}

export default MetadataTable;
