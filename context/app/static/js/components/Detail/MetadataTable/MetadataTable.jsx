import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import metadataFieldDescriptions from 'metadata-field-descriptions';
import { tableToDelimitedString, createDownloadUrl } from 'helpers/functions';
import { StyledTableContainer, HeaderCell } from 'shared-styles/Table';
import { DownloadIcon, Flex } from './style';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';

function MetadataTable(props) {
  const { metadata: tableData, display_doi } = props;

  const columns = [
    { id: 'key', label: 'Key' },
    { id: 'value', label: 'Value' },
    { id: 'description', label: 'Description' },
  ];

  const tableRows = Object.entries(tableData).map((entry) => ({
    key: entry[0],
    value: entry[1],
    description: metadataFieldDescriptions[entry[0]],
  }));

  const downloadUrl = createDownloadUrl(
    tableToDelimitedString(
      tableRows,
      columns.map((col) => col.label),
      '\t',
    ),
    'text/tab-separated-values',
  );

  return (
    <SectionContainer id="metadata-table">
      <Flex>
        <SectionHeader>Metadata</SectionHeader>
        <IconButton href={downloadUrl} download={`${display_doi}.tsv`}>
          <DownloadIcon color="primary" />
        </IconButton>
      </Flex>
      <Paper>
        <StyledTableContainer $maxHeight={364}>
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
                  <TableCell>{row.key}</TableCell>
                  <TableCell>{row.value}</TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </SectionContainer>
  );
}

MetadataTable.propTypes = {
  metadata: PropTypes.objectOf(PropTypes.string).isRequired,
  display_doi: PropTypes.string.isRequired,
};

export default MetadataTable;
