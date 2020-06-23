import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
// TODO: Why does eslint complain about this, but not about utils.js?
// eslint-disable-next-line import/no-unresolved
import metadataFieldDescriptions from 'metadata-field-descriptions';
import { StyledTableContainer, DownloadIcon, Flex } from './style';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';

const columns = [
  { id: 'key', label: 'Key' },
  { id: 'value', label: 'Value' },
  { id: 'description', label: 'Description' },
];

function tableToDelimitedString(rows, colNames, d) {
  const str = rows.reduce((acc, row) => {
    const rowStr = Object.values(row).join(d);
    return acc.concat('\n', rowStr);
  }, colNames.join(d));
  return str;
}

function createDownloadUrl(fileStr, fileType) {
  return window.URL.createObjectURL(new Blob([fileStr], { type: fileType }));
}

function MetadataTable(props) {
  const { metadata: tableData, display_doi } = props;

  const [tableRows, setTableRows] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    const rows = Object.entries(tableData).map((entry) => ({
      key: entry[0],
      value: entry[1],
      description: metadataFieldDescriptions[entry[0]],
    }));
    const fileStr = tableToDelimitedString(
      rows,
      columns.map((col) => col.label),
      '\t',
    );
    setDownloadUrl(createDownloadUrl(fileStr, 'text/tab-separated-values'));
    setTableRows(rows);
  }, [tableData]);

  return (
    <SectionContainer id="metadata-table">
      <Flex>
        <SectionHeader variant="h3" component="h2">
          Metadata
        </SectionHeader>
        <IconButton href={downloadUrl} download={`${display_doi}.tsv`}>
          <DownloadIcon color="primary" />
        </IconButton>
      </Flex>
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
};

export default MetadataTable;
