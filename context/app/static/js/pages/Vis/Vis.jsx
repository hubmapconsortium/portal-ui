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
    composite_data: {
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

function Vis() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const { searchData } = useSearchData(donorRaceSexQuery, elasticsearchEndpoint, nexusToken);
  if (!('aggregations' in searchData)) {
    return null;
  }

  function getCount(buckets, bloodType, race) {
    const filtered = buckets.filter(
      (b) => b.key['mapped_metadata.blood_type'] === bloodType && b.key['mapped_metadata.race'] === race,
    );
    return filtered.length ? filtered[0].doc_count : 0;
  }
  function getKeyValues(buckets, key) {
    return new Set(buckets.map((b) => b.key[key]));
  }
  const { buckets } = searchData?.aggregations.composite_data;

  const bloodTypes = getKeyValues(buckets, 'mapped_metadata.blood_type');
  /* const races = getKeyValues(buckets, 'mapped_metadata.race');
   */

  return (
    Object.keys(searchData).length && (
      <Paper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <HeaderCell> </HeaderCell>
                {bloodTypes.map((type) => (
                  <HeaderCell> {type} </HeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <HeaderCell> White </HeaderCell>
                {bloodTypes.map((type) => (
                  <TableCell> {getCount(buckets, type, 'White')} </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <HeaderCell> Black or African American </HeaderCell>
                {bloodTypes.map((type) => (
                  <TableCell> {getCount(buckets, type, 'Black or African American')} </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <HeaderCell> Hispanic </HeaderCell>
                {bloodTypes.map((type) => (
                  <TableCell> {getCount(buckets, type, 'Hispanic')} </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    )
  );
}

export default Vis;
