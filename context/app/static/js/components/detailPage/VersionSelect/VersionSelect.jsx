import React, { useEffect, useState, useContext } from 'react';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';
import { StyledButton, OverflowEllipsis, EmptyFullWidthDiv } from './style';
import { getCleanVersions } from './utils';

function VersionSelect({ uuid }) {
  const { entityEndpoint, groupsToken } = useContext(AppContext);
  const [versions, setVersions] = useState([]);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  const lowerCaseEntityType = 'dataset';

  useEffect(() => {
    async function fetchVersions() {
      const authHeader = getAuthHeader(groupsToken);
      const response = await fetch(`${entityEndpoint}/${lowerCaseEntityType}s/${uuid}/revisions`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });
      if (!response.ok) {
        console.error('Entity API failed', response);
        return;
      }
      const results = await response.json();
      const cleanResults = getCleanVersions(results);
      setVersions(cleanResults.sort((a, b) => b.revision_number - a.revision_number));
      setSelectedVersionIndex(cleanResults.findIndex((version) => version.uuid === uuid));
    }
    fetchVersions();
  }, [entityEndpoint, uuid, lowerCaseEntityType, groupsToken]);

  function visitNewVersion({ i }) {
    window.location.href = `/browse/dataset/${versions[i].uuid}`;
    // In the future, if it's not a dataset, the url will still redirect.
  }

  function getOptionDisplay(option) {
    return option?.revision_number ? (
      <OverflowEllipsis>Version {option.revision_number}</OverflowEllipsis>
    ) : (
      <EmptyFullWidthDiv />
    );
  }

  return (
    <DropdownListbox
      id="version-select"
      optionComponent={DropdownListboxOption}
      buttonComponent={StyledButton}
      selectedOptionIndex={selectedVersionIndex}
      options={versions}
      selectOnClick={visitNewVersion}
      getOptionLabel={getOptionDisplay}
      buttonProps={{ disabled: versions.length === 0, color: 'primary' }}
    />
  );
}

export default VersionSelect;
