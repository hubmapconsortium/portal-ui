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

const donorSexQuery = {
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
    'mapped_metadata.sex': {
      terms: {
        field: 'mapped_metadata.sex.keyword',
      },
    },
  },
};

// change to match the data
const columns = [
  { id: 'variable', label: 'Column Label Displayed' },
  { id: 'variable2', label: 'Column Label Displayed 2' },
];

function ExampleDonorTable() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  // eslint-disable-next-line no-unused-vars
  const { searchData } = useSearchData(donorSexQuery, elasticsearchEndpoint, nexusToken);

  return (
    searchData && (
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
              {searchData.aggregations.mapped_metadata.sex.buckets.map((bucket) => (
                // place data as children to header cells to match your chosen columns
                <TableRow key={bucket.key}>
                  <TableCell />
                  <TableCell />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    )
  );
}

export default ExampleDonorTable;
