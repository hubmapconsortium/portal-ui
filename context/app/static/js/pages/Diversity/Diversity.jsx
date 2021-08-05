import React, { useContext } from 'react';
import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import DonorChart from './DonorChart';
import ProjectAttribution from './ProjectAttribution';
import { PageTitleWrapper, PageTitle, ChartPaper, ChartTitle, DescriptionPaper } from './style';
import { getKeyValues, getAgeLabels } from './utils';

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

const threeColors = ['#444A65', '#6C8938', '#DA348A'];
const twoColors = threeColors.slice(0, 2);

function BloodTypeDescription() {
  return (
    <>
      It is critical to be aware that{' '}
      <OutboundLink href="https://www.redcrossblood.org/donate-blood/blood-types.html">
        some blood types are more common than others
      </OutboundLink>{' '}
      in a racially diverse population like the United States. The blood type of an individual can{' '}
      <OutboundLink href="https://www.pennmedicine.org/updates/blogs/health-and-wellness/2019/april/blood-types">
        predispose them to different kinds of medical conditions
      </OutboundLink>
      .
    </>
  );
}

function Diversity() {
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

  const { buckets } = searchData?.aggregations.composite_data;

  const age = getKeyValues(buckets, 'mapped_metadata.age');
  const headers = getAgeLabels(buckets, 'mapped_metadata.age');

  return (
    <>
      {Object.keys(searchData).length && (
        <>
          <PageTitleWrapper>
            <PageTitle variant="h2" component="h1">
              HuBMAP Donor Diversity
            </PageTitle>
            <DescriptionPaper>
              <Typography>
                The goal of HuBMAP is to develop an open and global platform to map healthy cells in the human body. To
                serve as a reference atlas for future studies in human disease, HuBMAP needs to include a diverse
                population of donors representing a broad spectrum of factors affecting health. These include age, sex,
                race, ethnicity, and many other factors. The visualizations on this page provide an overview of the
                distribution of these factors across all HuBMAP donors.
              </Typography>
            </DescriptionPaper>
          </PageTitleWrapper>
          <ChartTitle variant="h4" component="h2">
            Race & Age
          </ChartTitle>
          <ChartPaper>
            <StyledTableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <HeaderCell> </HeaderCell>
                    {headers.map((type) => (
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
          </ChartPaper>

          <DonorChart
            donorQuery={donorRaceSexQuery}
            xKey="mapped_metadata.blood_type"
            yKey="mapped_metadata.race"
            colorKeys={['White', 'Black or African American', 'Hispanic']}
            colors={threeColors}
            description={<BloodTypeDescription />}
            title="Blood Type & Race"
            yAxisLabel="# of Donors"
            xAxisLabel="Blood Type"
          />
          <DonorChart
            donorQuery={donorGenderRace}
            xKey="mapped_metadata.sex"
            yKey="mapped_metadata.race"
            colorKeys={['White', 'Black or African American', 'Hispanic']}
            colors={threeColors}
            title="Sex & Race"
            yAxisLabel="# of Donors"
            xAxisLabel="Sex"
          />
          <DonorChart
            donorQuery={donorBloodtypeGender}
            xKey="mapped_metadata.blood_type"
            yKey="mapped_metadata.sex"
            colorKeys={['Male', 'Female']}
            colors={twoColors}
            title="Blood Type & Sex"
            description={<BloodTypeDescription />}
            yAxisLabel="# of Donors"
            xAxisLabel="Blood Type"
          />
          <DonorChart
            donorQuery={donorAgeGender}
            xKey="mapped_metadata.age"
            yKey="mapped_metadata.sex"
            colorKeys={['Male', 'Female']}
            colors={twoColors}
            title="Age & Sex"
            yAxisLabel="# of Donors"
            xAxisLabel="Age"
          />
          <ProjectAttribution />
        </>
      )}
    </>
  );
}

export default Diversity;
