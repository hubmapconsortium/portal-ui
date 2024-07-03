import React from 'react';
import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { StyledButton, OverflowEllipsis, EmptyFullWidthDiv } from './style';
import { useVersions } from './hooks';
import { Version } from './types';

interface VersionSelectProps {
  uuid: string;
}

function VersionSelect({ uuid }: VersionSelectProps) {
  const { versions, selectedVersionIndex } = useVersions(uuid);

  function getOptionDisplay(option: Version) {
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
      selectOnClick={({ i }) => {
        window.location.href = `/browse/dataset/${versions[i].uuid}`;
      }}
      getOptionLabel={getOptionDisplay}
      buttonProps={{ disabled: versions.length === 0, color: 'primary' }}
    />
  );
}

export default VersionSelect;
