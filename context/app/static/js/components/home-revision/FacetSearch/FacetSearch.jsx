import React, { useState, useEffect, useRef, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { AppContext } from 'js/components/Providers';
import useSearchData from 'js/hooks/useSearchData';
import FacetSearchMenu from 'js/components/home-revision/FacetSearchMenu';
import { Background, FlexForm, StyledLabel, StyledInput } from './style';
import { getMatchingTerms } from './utils';

const labels = {
  sex: 'Sex',
  race: 'Race',
  mapped_organ: 'Organ',
  mapped_specimen_type: 'Specimen Type',
  mapped_data_types: 'Data Type',
  mapped_data_access_level: 'Status',
};

const donorAggsQuery = {
  size: 0,
  aggs: {
    [labels.sex]: {
      terms: {
        field: 'mapped_metadata.sex.keyword',
        size: 100,
      },
    },
    [labels.race]: {
      terms: {
        field: 'mapped_metadata.race.keyword',
        size: 100,
      },
    },
  },
};

const sampleAggsQuery = {
  size: 0,
  aggs: {
    [labels.sex]: {
      terms: {
        field: 'donor.mapped_metadata.sex.keyword',
        size: 100,
      },
    },
    [labels.race]: {
      terms: {
        field: 'donor.mapped_metadata.race.keyword',
        size: 100,
      },
    },
    [labels.mapped_organ]: {
      terms: {
        field: 'origin_sample.mapped_organ.keyword',
        size: 100,
      },
    },
    [labels.mapped_specimen_type]: {
      terms: {
        field: 'mapped_specimen_type.keyword',
        size: 100,
      },
    },
  },
};

const datasetAggsQuery = {
  size: 0,
  aggs: {
    [labels.sex]: {
      terms: {
        field: 'donor.mapped_metadata.sex.keyword',
        size: 100,
      },
    },
    [labels.race]: {
      terms: {
        field: 'donor.mapped_metadata.race.keyword',
        size: 100,
      },
    },
    [labels.mapped_organ]: {
      terms: {
        field: 'origin_sample.mapped_organ.keyword',
        size: 100,
      },
    },
    [labels.mapped_specimen_type]: {
      terms: {
        field: 'source_sample.mapped_specimen_type.keyword',
        size: 100,
      },
    },
    [labels.mapped_data_types]: {
      terms: {
        field: 'mapped_data_types.keyword',
        size: 100,
      },
    },
    [labels.mapped_data_access_level]: {
      terms: {
        field: 'mapped_data_access_level.keyword',
        size: 100,
      },
    },
  },
};

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
          <FacetSearchMenu anchorRef={anchorRef} matches={matches} />
        </FlexForm>
      </Container>
    </Background>
  );
}

export default FacetSearch;
