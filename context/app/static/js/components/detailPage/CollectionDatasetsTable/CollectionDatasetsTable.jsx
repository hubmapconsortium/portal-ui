import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { useCollectionsDatasets } from './hooks';
import { StyledLink } from './style';

function CollectionDatasetsTable({ datasets }) {
  const columns = [
    { id: 'hubmap_id', label: 'HuBMAP ID' },
    { id: 'origin_samples_unique_mapped_organs', label: 'Organ' },
    { id: 'mapped_data_types', label: 'Assay Types' },
    { id: 'last_modified_timestamp', label: 'Last Modified' },
    { id: 'created_by_user_displayname', label: 'Contact' },
    { id: 'mapped_status', label: 'Status' },
  ];

  const data = useCollectionsDatasets({ ids: datasets.map((d) => d.uuid), sourceFields: columns.map((c) => c.id) });

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
              {data.map(({ _source: dataset }) => (
                <TableRow key={dataset.hubmap_id}>
                  <TableCell>
                    <StyledLink href={`/browse/dataset/${dataset.uuid}`} variant="body2">
                      {dataset.hubmap_id}
                    </StyledLink>
                  </TableCell>
                  <TableCell>{dataset.origin_samples_unique_mapped_organs.join(' ')} </TableCell>
                  <TableCell>{dataset.mapped_data_types}</TableCell>
                  <TableCell>{format(dataset.last_modified_timestamp, 'yyyy-MM-dd')}</TableCell>
                  <TableCell>{dataset.created_by_user_displayname}</TableCell>
                  <TableCell>{dataset.mapped_status}</TableCell>
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
