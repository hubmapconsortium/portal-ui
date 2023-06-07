import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { StyledLink } from './style';

function CollectionDatasetsTable({ datasets }) {
  const columns = [
    { id: 'hubmap_id', label: 'HuBMAP ID' },
    { id: 'organ', label: 'Organ' },
    { id: 'data_types', label: 'Assay Types' },
    { id: 'last_modified_timestamp', label: 'Last Modified' },
    { id: 'properties.created_by_user_displayname', label: 'Contact' },
    { id: 'status', label: 'Status' },
  ];

  return (
    <DetailPageSection id="datasets-table">
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
              {datasets.map((dataset) => (
                <TableRow key={dataset.hubmap_id}>
                  <TableCell>
                    <StyledLink href={`/browse/dataset/${dataset.uuid}`} variant="body2">
                      {dataset.hubmap_id}
                    </StyledLink>
                  </TableCell>
                  <TableCell />
                  <TableCell>{dataset.data_types}</TableCell>
                  <TableCell>{format(dataset.last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{dataset.created_by_user_displayname}</TableCell>
                  <TableCell>{dataset.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </DetailPageSection>
  );
}

CollectionDatasetsTable.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CollectionDatasetsTable;
