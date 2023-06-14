import React, { useState, useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import useResizeObserver from 'use-resize-observer/polyfilled';

import useSearchData from 'js/hooks/useSearchData';
import FacetSearchMenu from 'js/components/home/FacetSearchMenu';
import { Background, FlexForm, StyledLabel, StyledInput } from './style';
import { getMatchingTerms, getAggsQuery } from './utils';

const baseLabels = {
  'mapped_metadata.sex': 'Sex',
  'mapped_metadata.race': 'Race',
  'origin_samples.mapped_organ': 'Organ',
  sample_category: 'Sample Category',
  mapped_data_types: 'Data Type',
};

const allLabels = {
  ...baseLabels,
  'donor.mapped_metadata.sex': baseLabels['mapped_metadata.sex'],
  'donor.mapped_metadata.race': baseLabels['mapped_metadata.race'],
  'source_samples.sample_category': baseLabels.sample_category,
};

const donorAggsQuery = getAggsQuery('donor', ['mapped_metadata.sex', 'mapped_metadata.race'], 100);
const sampleAggsQuery = getAggsQuery(
  'sample',
  ['donor.mapped_metadata.sex', 'donor.mapped_metadata.race', 'origin_samples.mapped_organ', 'sample_category'],
  100,
);

const datasetAggsQuery = getAggsQuery(
  'dataset',
  [
    'donor.mapped_metadata.sex',
    'donor.mapped_metadata.race',
    'origin_samples.mapped_organ',
    'source_samples.sample_category',
    'mapped_data_types',
  ],
  100,
);

function FacetSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState({});
  const anchorRef = useRef(null);
  const [menuIsOpen, setMenuIsOpen] = useState(true);

  const { width: searchInputWidth } = useResizeObserver({ ref: anchorRef });
  const { searchData: donorAggsData, isLoading: donorAggsDataIsLoading } = useSearchData(donorAggsQuery);
  const { searchData: sampleAggsData, isLoading: sampleAggsDataIsLoading } = useSearchData(sampleAggsQuery);
  const { searchData: datasetAggsData, isLoading: datasetAggsDataIsLoading } = useSearchData(datasetAggsQuery);

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
            const tempAcc = { ...acc };
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
