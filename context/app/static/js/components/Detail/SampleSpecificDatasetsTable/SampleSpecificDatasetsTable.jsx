import React from 'react';
import format from 'date-fns/format';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { LightBlueLink } from 'js/shared-styles/Links';
import { StyledButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/RightAlignedButtonRow';

function SampleSpecificDatasetsTable({ datasets, uuid }) {
  const columns = [
    { id: 'display_doi', label: 'HuBMAP ID' },
    { id: 'mapped_data_types', label: 'Data Types' },
    { id: 'status', label: 'Status' },
    { id: 'descendant_counts.entity_type.Dataset', label: 'Derived Dataset Count' },
    { id: 'last_modified_timestamp', label: 'Last Modified' },
  ];

  return (
    <SectionContainer id="datasets-table">
      <SectionHeader>Datasets</SectionHeader>
      <StyledButtonRow
        leftText={
          <BottomAlignedTypography variant="subtitle1" color="primary">
            {datasets.length} Datasets
          </BottomAlignedTypography>
        }
        buttons={
          <Button
            variant="contained"
            color="primary"
            component="a"
            href={`/search?ancestor_ids[0]=${uuid}&entity_type[0]=Dataset`}
          >
            View Data on Search Page
          </Button>
        }
      />

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
              {datasets.map(
                ({
                  _source: {
                    uuid: datasetUUID,
                    display_doi,
                    mapped_data_types,
                    status,
                    descendant_counts,
                    last_modified_timestamp,
                  },
                }) => (
                  <TableRow key={display_doi}>
                    <TableCell>
                      <LightBlueLink href={`/browse/dataset/${datasetUUID}`} variant="body2">
                        {display_doi}
                      </LightBlueLink>
                    </TableCell>
                    <TableCell>{mapped_data_types}</TableCell>
                    <TableCell>{status}</TableCell>
                    <TableCell>{descendant_counts?.entity_type?.Dataset || 0}</TableCell>
                    <TableCell>{format(last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </SectionContainer>
  );
}

export default SampleSpecificDatasetsTable;
