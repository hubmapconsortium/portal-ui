import React, { useContext } from 'react';
import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import DemographicsChartVertical from './DemographicsChartVertical';
import DonorChart from './DonorChart';

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

const donorGenderRace = {
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
            'mapped_metadata.sex': {
              terms: {
                field: 'mapped_metadata.sex.keyword',
              },
            },
          },
        ],
        size: 10000,
      },
    },
  },
};

const donorBloodtypeGender = {
  size: 0,
  aggs: {
    composite_data: {
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

const donorAgeGender = {
  size: 0,
  aggs: {
    composite_data: {
      composite: {
        sources: [
          {
            'mapped_metadata.age': {
              histogram: {
                field: 'mapped_metadata.age_value',
                interval: 10,
              },
            },
          },
          {
            'mapped_metadata.sex': {
              terms: {
                field: 'mapped_metadata.sex.keyword',
              },
            },
          },
        ],
        size: 10000,
      },
    },
  },
};

const donorAgeRace = {
  size: 0,
  aggs: {
    composite_data: {
      composite: {
        sources: [
          {
            'mapped_metadata.age': {
              histogram: {
                field: 'mapped_metadata.age_value',
                interval: 10,
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
        size: 10000,
      },
    },
  },
};

function Vis() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const { searchData } = useSearchData(donorAgeRace, elasticsearchEndpoint, nexusToken);
  if (!('aggregations' in searchData)) {
    return null;
  }
  function getCount(buckets, age, race) {
    const filtered = buckets.filter(
      (b) => b.key['mapped_metadata.age'] === age && b.key['mapped_metadata.race'] === race,
    );
    return filtered.length ? filtered[0].doc_count : 0;
  }
  function getKeyValues(buckets, key) {
    return [...new Set(buckets.map((b) => b.key[key]))];
  }
  const { buckets } = searchData?.aggregations.composite_data;

  const age = getKeyValues(buckets, 'mapped_metadata.age');

  return (
    Object.keys(searchData).length && (
      <Paper>
        <DonorChart
          donorQuery={donorRaceSexQuery}
          xKey="mapped_metadata.blood_type"
          yKey="mapped_metadata.race"
          colorKeys={['White', 'Black or African American', 'Hispanic']}
          colors={['#DA348A', '#5f9ada', '#db765d']}
          title="Blood Type and Race"
        />
        <DemographicsChartVertical
          donorQuery={donorGenderRace}
          xKey="mapped_metadata.sex"
          yKey="mapped_metadata.race"
          colorKeys={['White', 'Black or African American', 'Hispanic']}
          colors={['#DA348A', '#5f9ada', '#db765d']}
          title="Gender and Ethnicity"
        />
        <DonorChart
          donorQuery={donorBloodtypeGender}
          xKey="mapped_metadata.blood_type"
          yKey="mapped_metadata.sex"
          colorKeys={['Male', 'Female']}
          colors={['#6C8938', '#D25435']}
          title="Blood Type and Gender"
        />
        <DonorChart
          donorQuery={donorAgeGender}
          xKey="mapped_metadata.age"
          yKey="mapped_metadata.sex"
          colorKeys={['Male', 'Female']}
          colors={['#6C8938', '#D25435']}
          title="Age and Gender"
        />
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <HeaderCell> </HeaderCell>
                {age.map((type) => (
                  <HeaderCell> {type} </HeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <HeaderCell> White </HeaderCell>
                {age.map((type) => (
                  <TableCell> {getCount(buckets, type, 'White')} </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <HeaderCell> Black or African American </HeaderCell>
                {age.map((type) => (
                  <TableCell> {getCount(buckets, type, 'Black or African American')} </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <HeaderCell> Hispanic </HeaderCell>
                {age.map((type) => (
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
