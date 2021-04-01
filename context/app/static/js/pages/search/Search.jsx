import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import DatasetSearchPrompt from 'js/components/tutorials/DatasetSearchPrompt';
import SearchDatasetTutorial from 'js/components/tutorials/SearchDatasetTutorial';
import { AppContext } from 'js/components/Providers';
import LookupEntity from 'js/helpers/LookupEntity';
import { getAuthHeader } from 'js/helpers/functions';
import SearchWrapper from 'js/components/Search/SearchWrapper';
import { donorConfig, sampleConfig, datasetConfig } from 'js/components/Search/config';
import { listFilter } from 'js/components/Search/utils';
import AncestorNote from 'js/components/Search/AncestorNote';
import Results from 'js/components/Search/Results';
import useSearchDatasetTutorialStore from 'js/stores/useSearchDatasetTutorialStore';
import { SearchHeader } from './style';

const searchDatasetTutorialSelector = (state) => ({
  runSearchDatasetTutorial: state.runSearchDatasetTutorial,
  setRunSearchDatasetTutorial: state.setRunSearchDatasetTutorial,
  searchDatasetTutorialStep: state.searchDatasetTutorialStep,
  tutorialHasExited: state.tutorialHasExited,
  closeSearchDatasetTutorial: state.closeSearchDatasetTutorial,
});

function Search(props) {
  const { title } = props;
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const {
    runSearchDatasetTutorial,
    setRunSearchDatasetTutorial,
    searchDatasetTutorialStep,
    tutorialHasExited,
    closeSearchDatasetTutorial,
  } = useSearchDatasetTutorialStore(searchDatasetTutorialSelector);

  const hiddenFilters = [listFilter('ancestor_ids', 'Ancestor ID'), listFilter('entity_type', 'Entity Type')];

  const filtersByType = {
    donor: { ...donorConfig.filters, '': hiddenFilters },
    sample: { ...sampleConfig.filters, '': hiddenFilters },
    dataset: { ...datasetConfig.filters, '': hiddenFilters },
  };

  const resultFieldsByType = {
    donor: donorConfig.fields,
    sample: sampleConfig.fields,
    dataset: datasetConfig.fields,
  };

  const searchParams = new URLSearchParams(window.location.search);
  const typeParam = 'entity_type[0]';
  const type = (searchParams.get(typeParam) || '').toLowerCase();
  if (!(type in resultFieldsByType)) {
    throw Error(
      `Unexpected URL param "${typeParam}=${type}"; Should be one of {${Object.keys(resultFieldsByType).join(', ')}}`,
    );
  }
  const hasAncestorParam = searchParams.has('ancestor_ids[0]');

  const httpHeaders = getAuthHeader(nexusToken);
  const resultFields = resultFieldsByType[type];
  const searchProps = {
    // The default behavior is to add a "_search" path.
    // We don't want that.
    searchUrlPath: '',
    // Pass Globus token:
    httpHeaders,
    // Prefix for details links:
    detailsUrlPrefix: `/browse/${type || 'dataset'}/`,
    // Search results field which will be appended to detailsUrlPrefix:
    idField: 'uuid',
    // Search results fields to display in table:
    resultFields,
    // Default hitsPerPage is 10:
    hitsPerPage: 18,
    // Entity type
    type,
    // Sidebar facet configuration:
    filters: filtersByType[type],
    queryFields: ['everything'],
    isLoggedIn: Boolean(nexusToken),
    apiUrl: elasticsearchEndpoint,
  };

  const wrappedSearch = <SearchWrapper {...searchProps} resultsComponent={Results} />;

  return (
    <>
      <SearchHeader component="h1" variant="h2">
        {title}
      </SearchHeader>
      {!tutorialHasExited && type === 'dataset' && (
        <>
          <DatasetSearchPrompt setRunTutorial={setRunSearchDatasetTutorial} />
          <SearchDatasetTutorial
            runTutorial={runSearchDatasetTutorial}
            closeSearchDatasetTutorial={closeSearchDatasetTutorial}
            stepIndex={searchDatasetTutorialStep}
          />
        </>
      )}
      {hasAncestorParam && (
        <LookupEntity
          uuid={searchParams.get('ancestor_ids[0]')}
          elasticsearchEndpoint={elasticsearchEndpoint}
          nexusToken={nexusToken}
        >
          <AncestorNote />
        </LookupEntity>
      )}
      {wrappedSearch}
    </>
  );
}

Search.propTypes = {
  title: PropTypes.string.isRequired,
  nexusToken: PropTypes.string,
};

Search.defaultProps = {
  nexusToken: '',
};

export default Search;
