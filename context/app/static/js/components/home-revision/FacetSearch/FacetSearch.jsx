import React, { useState, useEffect, useRef, useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import useResizeObserver from 'use-resize-observer/polyfilled';

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

const donorAggsQuery = getAggsQuery('donor', ['mapped_metadata.sex', 'mapped_metadata.race'], 100);
const sampleAggsQuery = getAggsQuery(
  'sample',
  ['donor.mapped_metadata.sex', 'donor.mapped_metadata.race', 'origin_sample.mapped_organ', 'mapped_specimen_type'],
  100,
);

const datasetAggsQuery = getAggsQuery(
  'dataset',
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
  const [matches, setMatches] = useState({});
  const anchorRef = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(true);

  const { width: searchInputWidth } = useResizeObserver({ ref: anchorRef });
  const { searchData: donorAggsData, isLoading: donorAggsDataIsLoading } = useSearchData(
    donorAggsQuery,
    elasticsearchEndpoint,
    nexusToken,
  );
  const { searchData: sampleAggsData, isLoading: sampleAggsDataIsLoading } = useSearchData(
    sampleAggsQuery,
    elasticsearchEndpoint,
    nexusToken,
  );
  const { searchData: datasetAggsData, isLoading: datasetAggsDataIsLoading } = useSearchData(
    datasetAggsQuery,
    elasticsearchEndpoint,
    nexusToken,
  );

  const isLoading = donorAggsDataIsLoading || sampleAggsDataIsLoading || datasetAggsDataIsLoading;

  useEffect(() => {
    if (!isLoading && searchTerm.length > 0) {
      // order of objects in array matters, we want dataset matches to appear first.
      setMatches(
        [
          { entityType: 'Dataset', aggs: datasetAggsData },
          { entityType: 'Sample', aggs: sampleAggsData },
          { entityType: 'Donor', aggs: donorAggsData },
        ].reduce((acc, entityData) => {
          const matchingTerms = getMatchingTerms(entityData.aggs, searchTerm);
          if (Object.keys(matchingTerms).length > 0) {
            const tempAcc = acc;
            tempAcc[entityData.entityType] = matchingTerms;
            return tempAcc;
          }
          return acc;
        }, {}),
      );
    } else {
      setMatches({});
    }
  }, [donorAggsData, sampleAggsData, datasetAggsData, searchTerm, isLoading]);

  return (
    <Background>
      <Container maxWidth="lg">
        <FlexForm onSubmit={(e) => e.preventDefault()}>
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
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setMenuIsOpen(true);
            }}
            autoComplete="off"
          />
          {searchTerm.length > 0 && (
            <FacetSearchMenu
              anchorRef={anchorRef}
              matches={matches}
              labels={allLabels}
              searchInputWidth={searchInputWidth}
              isLoading={isLoading}
              menuIsOpen={menuIsOpen}
              setMenuIsOpen={setMenuIsOpen}
            />
          )}
        </FlexForm>
      </Container>
    </Background>
  );
}

export default FacetSearch;
