import React, { useState, useEffect, useRef, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';
import FacetSearchMenu from 'js/components/home-revision/FacetSearchMenu';
import { Background, FlexForm, StyledLabel, StyledInput } from './style';
import { getMatchingTerms, getAggsQuery } from './utils';

const baseLabels = {
  'mapped_metadata.sex': 'Sex',
  'mapped_metadata.race': 'Race',
  'origin_sample.mapped_organ': 'Organ',
  mapped_specimen_type: 'Specimen Type',
  mapped_data_types: 'Data Type',
  mapped_data_access_level: 'Status',
};

const allLabels = {
  ...baseLabels,
  'donor.mapped_metadata.sex': baseLabels['mapped_metadata.sex'],
  'donor.mapped_metadata.race': baseLabels['mapped_metadata.race'],
  'source_sample.mapped_specimen_type': baseLabels.mapped_specimen_type,
};

const donorAggsQuery = getAggsQuery(['mapped_metadata.sex', 'mapped_metadata.race'], 100);
const sampleAggsQuery = getAggsQuery(
  ['donor.mapped_metadata.sex', 'donor.mapped_metadata.race', 'origin_sample.mapped_organ', 'mapped_specimen_type'],
  100,
);

const datasetAggsQuery = getAggsQuery(
  [
    'donor.mapped_metadata.sex',
    'donor.mapped_metadata.race',
    'origin_sample.mapped_organ',
    'source_sample.mapped_specimen_type',
    'mapped_data_types',
    'mapped_data_access_level',
  ],
  100,
);

function FacetSearch() {
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const anchorRef = useRef(null);

  const { searchData: donorAggsData } = useSearchData(donorAggsQuery, elasticsearchEndpoint, nexusToken);
  const { searchData: sampleAggsData } = useSearchData(sampleAggsQuery, elasticsearchEndpoint, nexusToken);
  const { searchData: datasetAggsData } = useSearchData(datasetAggsQuery, elasticsearchEndpoint, nexusToken);

  useEffect(() => {
    if (
      Object.keys(donorAggsData).length > 0 &&
      Object.keys(sampleAggsData).length > 0 &&
      Object.keys(datasetAggsData).length > 0 &&
      searchTerm.length > 0
    ) {
      setMatches(
        [donorAggsData, sampleAggsData, datasetAggsData].map((aggsData) => getMatchingTerms(aggsData, searchTerm)),
      );
    } else {
      setMatches([]);
    }
  }, [donorAggsData, sampleAggsData, datasetAggsData, searchTerm]);

  return (
    <Background>
      <Container maxWidth="lg">
        <FlexForm>
          <StyledLabel htmlFor="facet-search">
            <Typography variant="h5" component="span">
              Search Portal
            </Typography>
          </StyledLabel>
          <StyledInput
            ref={anchorRef}
            id="facet-search"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            autoComplete="off"
          />
          <FacetSearchMenu anchorRef={anchorRef} matches={matches} labels={allLabels} />
        </FlexForm>
      </Container>
    </Background>
  );
}

export default FacetSearch;
