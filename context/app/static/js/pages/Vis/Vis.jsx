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

const donorRaceQuery = {
  size: 0,
  query: {
    bool: {
      filter: {
        term: {
          entity_type: 'donor',
        },
      },
    },
  },
  aggs: {
    'mapped_metadata.race': {
      terms: {
        field: 'mapped_metadata.race.keyword',
      },
    },
  },
};

function Vis() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const { searchData } = useSearchData(donorRaceQuery, elasticsearchEndpoint, nexusToken);
  if (!('aggregations' in searchData)) {
    return null;
  }
  const { buckets } = searchData.aggregations['mapped_metadata.race'];

  return (
    <Paper>
      <StyledTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {buckets.map((bucket) => (
                <HeaderCell key={bucket.key}>{bucket.key}</HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {buckets.map((bucket) => (
                <TableCell>{bucket.doc_count}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
}

export default Vis;
