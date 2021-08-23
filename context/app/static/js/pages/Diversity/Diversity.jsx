import React from 'react';
import useSearchData from 'js/hooks/useSearchData';
import Typography from '@material-ui/core/Typography';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import DonorChart from './DonorChart';
import ProjectAttribution from './ProjectAttribution';
import { PageTitleWrapper, PageTitle, DescriptionPaper } from './style';
import { makeCompositeQuery, makeHistogramSource, makeTermSource } from './utils';

const donorAgeRaceQuery = makeCompositeQuery(makeHistogramSource('age'), makeTermSource('race'));
const donorRaceBloodTypeQuery = makeCompositeQuery(makeTermSource('race'), makeTermSource('blood_type'));
const donorRaceSexQuery = makeCompositeQuery(makeTermSource('race'), makeTermSource('sex'));
const donorSexBloodTypeQuery = makeCompositeQuery(makeTermSource('sex'), makeTermSource('blood_type'));
const donorAgeSexQuery = makeCompositeQuery(makeHistogramSource('age'), makeTermSource('sex'));

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
  const { searchData } = useSearchData(donorAgeRaceQuery);
  if (!('aggregations' in searchData)) {
    return null;
  }

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

          <DonorChart
            donorQuery={donorAgeRaceQuery}
            xKey="mapped_metadata.age"
            yKey="mapped_metadata.race"
            colorKeys={['White', 'Black or African American', 'Hispanic']}
            colors={threeColors}
            title="Age & Race"
            yAxisLabel="# of Donors"
            xAxisLabel="Age"
          />
          <DonorChart
            donorQuery={donorRaceBloodTypeQuery}
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
            donorQuery={donorRaceSexQuery}
            xKey="mapped_metadata.sex"
            yKey="mapped_metadata.race"
            colorKeys={['White', 'Black or African American', 'Hispanic']}
            colors={threeColors}
            title="Sex & Race"
            yAxisLabel="# of Donors"
            xAxisLabel="Sex"
          />
          <DonorChart
            donorQuery={donorSexBloodTypeQuery}
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
            donorQuery={donorAgeSexQuery}
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
