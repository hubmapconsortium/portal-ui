import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import metadataFieldDescriptions from 'metadata-field-descriptions';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { tableToDelimitedString, createDownloadUrl } from 'js/helpers/functions';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import {
  DownloadIcon,
  Flex,
  StyledWhiteBackgroundIconButton,
  StyledSectionHeader,
  FlexTableCell,
  StyledInfoIcon,
} from './style';

function MetadataTable(props) {
  const { metadata: tableData, display_doi } = props;

  const columns = [
    { id: 'key', label: 'Key' },
    { id: 'value', label: 'Value' },
  ];

  const tableRows = Object.entries(tableData)
    // To suppress nested objects, like nested "metadata" for Samples:
    .filter((entry) => typeof entry[1] !== 'object')
    .map((entry) => ({
      key: entry[0],
      value: Array.isArray(entry[1]) ? entry[1].join(', ') : entry[1].toString(),
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
    <SectionContainer id="metadata">
      <Flex>
        <StyledSectionHeader>Metadata</StyledSectionHeader>
        <SecondaryBackgroundTooltip title="Download">
          <StyledWhiteBackgroundIconButton href={downloadUrl} download={`${display_doi}.tsv`}>
            <DownloadIcon color="primary" />
          </StyledWhiteBackgroundIconButton>
        </SecondaryBackgroundTooltip>
      </Flex>
      <Paper>
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
                  <FlexTableCell>
                    {row.key}
                    {row.description && (
                      <SecondaryBackgroundTooltip title={row.description} placement="bottom-start">
                        <StyledInfoIcon color="primary" />
                      </SecondaryBackgroundTooltip>
                    )}
                  </FlexTableCell>
                  <TableCell>{row.value}</TableCell>
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
