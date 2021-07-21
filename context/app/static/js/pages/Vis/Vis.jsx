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
            'mapped_metadata.race': {
              terms: {
                field: 'mapped_metadata.race.keyword',
              },
            },
          },
          {
            'mapped_metadata.blood_type': {
              terms: {
                field: 'mapped_metadata.blood_type.keyword',
              },
            },
          },
        ],
        size: 10000,
      },
    },
  },
};

const columns = [
  { id: 'none', label: '          ' },
  { id: 'a', label: 'A' },
  { id: 'ab', label: 'AB' },
  { id: 'b', label: 'B' },
  { id: 'o', label: 'O' },
];

function Vis() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const { searchData } = useSearchData(donorRaceSexQuery, elasticsearchEndpoint, nexusToken);
  if (!('aggregations' in searchData)) {
    return null;
  }

  const { buckets } = searchData.aggregations[('mapped_metadata.race', 'mapped_metadata.blood_type')];
  const result = buckets.filter(
    (bucket) => bucket.key['mapped_metadata.blood_type'] === 'O' && bucket.key['mapped_metadata.race'] === 'White',
  );

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
                <TableCell> White </TableCell>
                <TableCell> </TableCell>
                <TableCell> {searchData.aggregations.mapped_data_types.buckets[5].doc_count}</TableCell>
                <TableCell> {searchData.aggregations.mapped_data_types.buckets[6].doc_count}</TableCell>
                <TableCell> {result[0].doc_count} </TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell> Black or African American </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> {searchData.aggregations.mapped_data_types.buckets[1].doc_count}</TableCell>
                <TableCell> {searchData.aggregations.mapped_data_types.buckets[2].doc_count}</TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow>
                <TableCell> Hispanic </TableCell>
                <TableCell> </TableCell>
                <TableCell> {searchData.aggregations.mapped_data_types.buckets[3].doc_count}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    )
  );
}

export default Vis;
