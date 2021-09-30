import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import DatasetSearchPrompt from 'js/components/tutorials/DatasetSearchPrompt';
import SearchDatasetTutorial from 'js/components/tutorials/SearchDatasetTutorial';
import { AppContext } from 'js/components/Providers';
import LookupEntity from 'js/helpers/LookupEntity';
import { getAuthHeader, getDefaultQuery } from 'js/helpers/functions';
import SearchWrapper from 'js/components/Search/SearchWrapper';
import { donorConfig, sampleConfig, datasetConfig, fieldsToHighlight } from 'js/components/Search/config';
import { listFilter } from 'js/components/Search/utils';
import SearchNote from 'js/components/Search/SearchNote';
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

  const hiddenFilters = [
    listFilter('ancestor_ids', 'Ancestor ID'),
    listFilter('entity_type', 'Entity Type'),
    listFilter('descendant_ids', 'Descendant ID'),
  ];

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

  const notesToDisplay = [
    { urlSearchParam: 'ancestor_ids[0]', label: 'Derived from' },
    { urlSearchParam: 'descendant_ids[0]', label: 'Ancestor of' },
  ].filter((note) => searchParams.has(note.urlSearchParam));

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
    queryFields: ['all_text', ...fieldsToHighlight],
    isLoggedIn: Boolean(nexusToken),
    apiUrl: elasticsearchEndpoint,
    defaultQuery: getDefaultQuery(),
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
      {notesToDisplay.map((note) => (
        <LookupEntity
          uuid={searchParams.get(note.urlSearchParam)}
          key={note.urlSearchParam}
          elasticsearchEndpoint={elasticsearchEndpoint}
          nexusToken={nexusToken}
        >
          <SearchNote label={note.label} />
        </LookupEntity>
      ))}
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
