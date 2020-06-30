import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { StyledTableContainer, HeaderCell, StyledLink } from './style';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';

function CollectionDatasetsTable(props) {
  const { datasets } = props;

  const columns = [
    { id: 'display_doi', label: 'HuBMAP ID' },
    { id: 'organ', label: 'Organ' },
    { id: 'assayTypesString', label: 'Assay Types' },
    { id: 'modifiedDate', label: 'Last Modified' },
    { id: 'properties.creator_name', label: 'Creator' },
    { id: 'properties.status', label: 'Status' },
  ];

  const tableRows = datasets.reduce((rows, dataset) => {
    if (dataset.entitytype === 'Dataset') {
      rows.push({
        ...dataset,
        assayTypesString: dataset.properties.data_types.join(', '),
        modifiedDate: new Date(dataset.properties.provenance_modified_timestamp).toDateString(),
      });
    }
    return rows;
  }, []);

  return (
    <SectionContainer id="datasets-table">
      <SectionHeader variant="h3" component="h2">
        Datasets
      </SectionHeader>
      <Typography variant="subtitle1" color="primary">
        {tableRows.length} Datasets
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
              {tableRows.map((row) => (
                <TableRow key={row.display_doi}>
                  <TableCell>
                    <StyledLink href={`/browse/dataset/${row.uuid}`} variant="body2">
                      {row.display_doi}
                    </StyledLink>
                  </TableCell>
                  <TableCell />
                  <TableCell>{row.assayTypesString}</TableCell>
                  <TableCell>{row.modifiedDate}</TableCell>
                  <TableCell>{row.properties.creator_name}</TableCell>
                  <TableCell>{row.properties.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </SectionContainer>
  );
}

export default CollectionDatasetsTable;
