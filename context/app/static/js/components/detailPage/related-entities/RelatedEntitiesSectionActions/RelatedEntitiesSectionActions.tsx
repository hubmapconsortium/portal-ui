import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { useFlaskDataContext } from 'js/components/Contexts';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import BulkDownloadButton from 'js/components/bulkDownload/BulkDownloadButton';

interface RelatedEntitiesSectionHeaderProps {
  searchPageHref: string;
  uuids: Set<string>;
}

export function RelatedEntitiesSectionActions({ searchPageHref, uuids }: RelatedEntitiesSectionHeaderProps) {
  const {
    entity: { uuid },
  } = useFlaskDataContext();
  const track = useTrackEntityPageEvent();

  return (
    <Stack direction="row" spacing={1}>
      {uuids && <BulkDownloadButton uuids={uuids} tooltip="Bulk download files for datasets in this table." />}
      <Button
        variant="contained"
        color="primary"
        component="a"
        href={searchPageHref}
        onClick={() =>
          track({
            action: `Derived Datasets Navigation / Navigate to Derived Datasets Search Page`,
            label: uuid,
          })
        }
        data-testid="view-related-data-button"
      >
        View Data on Search Page
      </Button>
    </Stack>
  );
}

export default RelatedEntitiesSectionActions;
