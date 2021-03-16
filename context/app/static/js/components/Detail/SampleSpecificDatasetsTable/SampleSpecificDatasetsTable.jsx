import React from 'react';
import format from 'date-fns/format';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { LightBlueLink } from 'js/shared-styles/Links';

function SampleSpecificDatasetsTable({ datasets }) {
  const columns = [
    { id: 'display_doi', label: 'HuBMAP ID' },
    { id: 'origin_sample.mapped_organ', label: 'Organ Type' },
    { id: 'mapped_data_types', label: 'Data Types' },
    { id: 'status', label: 'Status' },
    { id: 'descendant_counts.entity_type.Dataset', label: 'Derived Dataset Count' },
    { id: 'last_modified_timestamp', label: 'Last Modified' },
  ];

  return (
    <SectionContainer id="datasets-table">
      <SectionHeader>Datasets</SectionHeader>
      <Typography variant="subtitle1" color="primary">
        {datasets.length} Datasets
      </Typography>
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
                    display_doi,
                    uuid,
                    origin_sample,
                    mapped_data_types,
                    status,
                    descendant_counts,
                    last_modified_timestamp,
                  },
                }) => (
                  <TableRow key={display_doi}>
                    <TableCell>
                      <LightBlueLink href={`/browse/dataset/${uuid}`} variant="body2">
                        {display_doi}
                      </LightBlueLink>
                    </TableCell>
                    <TableCell> {origin_sample.mapped_organ}</TableCell>
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
