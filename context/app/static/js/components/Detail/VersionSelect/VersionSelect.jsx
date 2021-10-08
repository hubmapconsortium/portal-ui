import React, { useEffect, useState, useContext } from 'react';

import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';
import { StyledButton, VersionStatusIcon, Flex, OverflowEllipsis } from './style';

function VersionSelect({ uuid }) {
  const { entityEndpoint, nexusToken } = useContext(AppContext);
  const [versions, setVersions] = useState([]);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  const lowerCaseEntityType = 'dataset';
  const uuidKey = `${lowerCaseEntityType}_uuid`;

  useEffect(() => {
    async function fetchVersions() {
      const authHeader = getAuthHeader(nexusToken);
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
      setVersions(results.sort((a, b) => a.revision_number - b.revision_number));
      setSelectedVersionIndex(results.findIndex((version) => version[uuidKey] === uuid));
    }
    fetchVersions();
  }, [entityEndpoint, uuid, lowerCaseEntityType, uuidKey, nexusToken]);

  function visitNewVersion({ i }) {
    window.location.href = `/browse/dataset/${versions[i][uuidKey]}`;
  }

  function getOptionDisplay(option, i) {
    return (
      option?.revision_number && (
        <Flex>
          <VersionStatusIcon $iconColor={i === versions.length - 1 ? 'success' : 'warning'} />
          <OverflowEllipsis>v{option.revision_number}</OverflowEllipsis>
        </Flex>
      )
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
      buttonProps={{ disabled: versions.length === 0 }}
    />
  );
}

export default VersionSelect;
