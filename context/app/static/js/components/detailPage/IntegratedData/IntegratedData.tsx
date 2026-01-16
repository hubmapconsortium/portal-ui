import React, { useMemo } from 'react';

import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { CollapsibleDetailPageSection } from '../DetailPageSection';
import { Dataset, Donor, Sample } from 'js/components/types';
import IntegratedDataTables from './IntegratedDataTables';
import Button from '@mui/material/Button';
import { useFlaskDataContext } from 'js/components/Contexts';
import { DownloadIcon } from 'js/shared-styles/icons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useTrackEntityPageEvent } from '../useTrackEntityPageEvent';
import { useDownloadTSV } from 'js/hooks/useDownloadTSV';

interface IntegratedDataSectionProps {
  entities: (Donor | Dataset | Sample)[];
  includeCurrentEntity?: boolean;
}

function IntegratedDataSection({ entities, includeCurrentEntity }: IntegratedDataSectionProps) {
  const { entity } = useFlaskDataContext();

  const trackEntityPageEvent = useTrackEntityPageEvent();

  const fullEntities = useMemo(() => {
    const ents = [...entities];
    if (includeCurrentEntity) {
      ents.push(entity as Donor | Dataset | Sample);
    }
    return ents;
  }, [entities, entity, includeCurrentEntity]);

  const entityUUIDs = fullEntities.map((e) => e.uuid);

  const { initiateDownload, isLoading } = useDownloadTSV({
    lcPluralType: 'entities',
    uuids: entityUUIDs,
    analyticsCategory: 'Integrated Data',
  });

  return (
    <CollapsibleDetailPageSection
      id="integrated-data"
      title="Integrated Data"
      action={
        <SecondaryBackgroundTooltip title="Download all metadata as TSV.">
          <Button
            aria-label="Download all entities' metadata as TSV file."
            onClick={() => {
              trackEntityPageEvent({ action: `Integrated Data / Download All Metadata` });
              initiateDownload();
            }}
            disabled={isLoading}
            variant="contained"
            startIcon={<DownloadIcon color="white" />}
          >
            Download All
          </Button>
        </SecondaryBackgroundTooltip>
      }
    >
      <IntegratedDataTables
        entities={fullEntities}
        tableTooltips={{
          Dataset: 'Dataset count includes current dataset.',
        }}
      />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(IntegratedDataSection);
