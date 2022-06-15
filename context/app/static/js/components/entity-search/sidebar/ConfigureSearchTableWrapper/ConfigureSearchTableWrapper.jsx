import React, { useState } from 'react';

import ConfigureSearchTable from 'js/components/entity-search/sidebar/ConfigureSearchTable/ConfigureSearchTable';
import { Alert } from 'js/shared-styles/alerts';
import { filterFieldConfigs, getFieldEntriesSortedByConfigureGroup } from './utils';
import { FlexGrow, StyledSearchBar } from './style';

function ConfigureSearchTableWrapper({ availableFields, ...rest }) {
  const [searchBarFieldName, setSearchBarFieldName] = useState('');

  const handleChange = (event) => {
    setSearchBarFieldName(event.target.value);
  };

  const filteredFields = filterFieldConfigs(getFieldEntriesSortedByConfigureGroup(availableFields), searchBarFieldName);

  return (
    <FlexGrow>
      <StyledSearchBar fullWidth value={searchBarFieldName} onChange={handleChange} />
      {filteredFields.length > 0 ? (
        <ConfigureSearchTable filteredFields={filteredFields} {...rest} />
      ) : (
        <Alert severity="warning">No results found. Try different search terms or select/deselect filters.</Alert>
      )}
    </FlexGrow>
  );
}

export default ConfigureSearchTableWrapper;
