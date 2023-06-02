import React, { useContext } from 'react';
import { FlaskDataContext } from 'js/components/App';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import metadataFieldDescriptions from 'metadata-field-descriptions';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { tableToDelimitedString, createDownloadUrl } from 'js/helpers/functions';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import IconTooltipCell from 'js/shared-styles/tables/IconTooltipCell';
import { DetailPageSection } from 'js/components/detailPage/style';
import { DownloadIcon, Flex, StyledWhiteBackgroundIconButton, StyledSectionHeader } from './style';

function getDescription(field) {
  const [prefix, stem] = field.split('.');
  if (!stem) {
    return metadataFieldDescriptions[field];
  }
  const description = metadataFieldDescriptions[stem];
  if (!description) {
    return undefined;
  }
  if (prefix === 'donor') {
    return `For the original donor: ${metadataFieldDescriptions[stem]}`;
  }
  if (prefix === 'sample') {
    return `For the original sample: ${metadataFieldDescriptions[stem]}`;
  }
  throw new Error(`Unrecognized metadata field prefix: ${prefix}`);
}

function tableDataToRows(tableData) {
  return (
    Object.entries(tableData)
      // Filter out nested objects, like nested "metadata" for Samples...
      // but allow arrays. Remember, in JS: typeof [] === 'object'
      .filter((entry) => typeof entry[1] !== 'object' || Array.isArray(entry[1]))
      // Filter out fields from TSV that aren't really metadata:
      .filter((entry) => !['contributors_path', 'antibodies_path', 'version'].includes(entry[0]))
      .map((entry) => ({
        key: entry[0],
        value: Array.isArray(entry[1]) ? entry[1].join(', ') : entry[1].toString(),
        description: getDescription(entry[0]),
      }))
  );
}

function MetadataTable() {
  const { entity: assayMetadata } = useContext(FlaskDataContext);
  const { mapped_metadata, hubmap_id } = assayMetadata;
  const tableData = mapped_metadata || {};

  const columns = [
    { id: 'key', label: 'Key' },
    { id: 'value', label: 'Value' },
  ];

  const tableRows = tableDataToRows(tableData);

  const downloadUrl = createDownloadUrl(
    tableToDelimitedString(
      tableRows,
      columns.map((col) => col.label),
      '\t',
    ),
    'text/tab-separated-values',
  );

  return (
    <DetailPageSection id="metadata">
      <Flex>
        <StyledSectionHeader>Metadata</StyledSectionHeader>
        <SecondaryBackgroundTooltip title="Download">
          <StyledWhiteBackgroundIconButton href={downloadUrl} download={`${hubmap_id}.tsv`}>
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
                  <IconTooltipCell tooltipTitle={row?.description}>{row.key}</IconTooltipCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </DetailPageSection>
  );
}

export default MetadataTable;
export { tableDataToRows, getDescription };
