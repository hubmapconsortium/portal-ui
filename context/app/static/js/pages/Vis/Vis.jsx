import React, { useContext } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';

/* JSON query
 {
     "size": 0,
     "query": {
         "bool": {
             "filter": {
                 "term": {
                     "entity_type": "donor"
                 }
             }
         }
     },
     "aggs": {
         "mapped_metadata.sex": {
             "terms": {
                 "field": "mapped_metadata.sex.keyword"
             }
         }
     }
 }

 */

const donorRaceSexQuery = {
  size: 0,
  aggs: {
    mapped_data_types: {
      composite: {
        sources: [
          {
            'mapped_metadata.sex': {
              terms: {
                field: 'mapped_metadata.sex.keyword',
              },
            },
          },
          {
            'mapped_metadata.race': {
              terms: {
                field: 'mapped_metadata.race.keyword',
              },
            },
          },
        ],
        size: 0,
      },
    },
  },
};

const columns = [
  { id: 'none', label: '          ' },
  { id: 'white', label: 'White' },
  { id: 'black', label: 'Black or African American' },
  { id: 'hispanic', label: 'Hispanic' },
];

function Vis() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const { searchData } = useSearchData(donorRaceSexQuery, elasticsearchEndpoint, nexusToken);

  return (
    Object.keys(searchData).length && (
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
              <TableRow>
                <TableCell> Male </TableCell>
                <TableCell> {searchData.aggregations.mapped_data_types.buckets[4].doc_count}</TableCell>
                <TableCell> {searchData.aggregations.mapped_data_types.buckets[2].doc_count}</TableCell>
                <TableCell> {searchData.aggregations.mapped_data_types.buckets[3].doc_count}</TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell> Female</TableCell>
                <TableCell> {searchData.aggregations.mapped_data_types.buckets[1].doc_count}</TableCell>
                <TableCell> {searchData.aggregations.mapped_data_types.buckets[0].doc_count}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    )
  );
}

export default Vis;
