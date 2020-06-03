/* eslint-disable camelcase */
import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// TODO: Why does eslint complain about this, but not about utils.js?
// eslint-disable-next-line import/no-unresolved
import metadataFieldDescriptions from 'metadata-field-descriptions';
import SectionHeader from './SectionHeader';
import SectionContainer from './SectionContainer';

const StyledTableContainer = styled(TableContainer)`
  max-height: 364px;
`;

const columns = [
  { id: 'key', label: 'Key' },
  { id: 'value', label: 'Value' },
  { id: 'description', label: 'Description' },
];

function MetadataTable(props) {
  const { metadata: tableData } = props;
  const rows = Object.entries(tableData).map((entry) => ({ key: entry[0], value: entry[1] }));
  return (
    <SectionContainer id="metadata-table">
      <SectionHeader variant="h3" component="h2">
        Metadata
      </SectionHeader>
      <Paper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow>
                  <TableCell>{row.key}</TableCell>
                  <TableCell>{row.value}</TableCell>
                  <TableCell>{metadataFieldDescriptions[row.key]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </SectionContainer>
  );
}

export default MetadataTable;
