import React from 'react';
import DropdownListbox from 'js/shared-styles/dropdowns/DropdownListbox';
import DropdownListboxOption from 'js/shared-styles/dropdowns/DropdownListboxOption';
import { StyledButton, OverflowEllipsis, EmptyFullWidthDiv } from './style';
import { Version } from './types';
import { useSelectedVersionStore } from './SelectedVersionStore';
import { useProcessedDatasetContext } from '../ProcessedData/ProcessedDataset/ProcessedDatasetContext';
import { useTrackEntityPageEvent } from '../useTrackEntityPageEvent';

function getOptionDisplay(option: Version) {
  return option?.revision_number ? (
    <OverflowEllipsis>Version {option.revision_number}</OverflowEllipsis>
  ) : (
    <EmptyFullWidthDiv />
  );
}

function VersionSelect() {
  const { sectionDataset } = useProcessedDatasetContext();
  const track = useTrackEntityPageEvent();

  const { versions, setSelectedVersion, currentSelectedVersion } = useSelectedVersionStore((state) => ({
    versions: state.versions.get(sectionDataset.uuid) ?? [],
    currentSelectedVersion: state.selectedVersions.get(sectionDataset.uuid),
    setSelectedVersion: state.setSelectedVersion,
  }));

  const selectedVersionIndex = versions.findIndex((version) => version.uuid === currentSelectedVersion?.uuid);

  return (
    <DropdownListbox
      id={`version-select-${sectionDataset.uuid}`}
      optionComponent={DropdownListboxOption}
      buttonComponent={StyledButton}
      selectedOptionIndex={selectedVersionIndex}
      options={versions}
      selectOnClick={({ option }) => {
        setSelectedVersion(sectionDataset.uuid, option);
        track({
          action: `Change to version ${option.revision_number} (${option.uuid})`,
          label: sectionDataset.hubmap_id,
        });
      }}
      getOptionLabel={getOptionDisplay}
      buttonProps={{ disabled: versions.length === 0, color: 'primary' }}
    />
  );
}

export default VersionSelect;
