import React from 'react';
import { InternalLink } from 'js/shared-styles/Links';
import { DetailPageAlert } from '../../style';
import { useProcessedDatasetContext } from './ProcessedDatasetContext';
import { useSelectedVersionStore } from '../../VersionSelect/SelectedVersionStore';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';

export function OldVersionAlert() {
  const { sectionDataset } = useProcessedDatasetContext();

  const { versions, setSelectedVersion, currentSelectedVersion } = useSelectedVersionStore((state) => ({
    versions: state.versions.get(sectionDataset.uuid) ?? [],
    currentSelectedVersion: state.selectedVersions.get(sectionDataset.uuid),
    setSelectedVersion: state.setSelectedVersion,
  }));

  const isLatest = versions.length === 0 || currentSelectedVersion?.uuid === sectionDataset.uuid;

  const track = useTrackEntityPageEvent();

  if (isLatest) {
    return null;
  }

  return (
    <DetailPageAlert severity="warning">
      <span>
        {/* <span> to override "display: flex" which splits this on to multiple lines. */}
        You are viewing an older version of this dataset. Navigate to the{' '}
        <InternalLink
          onClick={() => {
            setSelectedVersion(sectionDataset.uuid, sectionDataset.uuid);
            track({
              action: `Change to latest version (${sectionDataset.uuid})`,
              label: sectionDataset.hubmap_id,
            });
          }}
          href="#;" // This dummy href is required to prevent the page from scrolling to the top.
        >
          latest version
        </InternalLink>
        .
      </span>
    </DetailPageAlert>
  );
}
