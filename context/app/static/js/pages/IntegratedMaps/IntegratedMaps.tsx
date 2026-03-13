import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEventCallback } from '@mui/material/utils';

import PanelListLandingPage from 'js/shared-styles/panels/PanelListLandingPage';
import { trackEvent } from 'js/helpers/trackers';
import { description, DataProductsTable } from 'js/components/organ/DataProducts/DataProducts';
import { useAllDataProducts } from './hooks';

function IntegratedMaps() {
  const { dataProducts, isLoading } = useAllDataProducts();

  const handleTrack = useEventCallback(
    ({
      action,
      assayName,
      tissueType,
      fileName,
    }: {
      action: string;
      assayName: string;
      tissueType: string;
      fileName?: string;
    }) => {
      trackEvent({
        category: 'Integrated Maps Page',
        action,
        label: `Tissue: ${tissueType} Assay: ${assayName}${fileName ? ` File: ${fileName}` : ''}`,
      });
    },
  );

  return (
    <PanelListLandingPage
      title="Integrated Maps"
      subtitle={!isLoading ? `${dataProducts.length} Integrated Maps` : undefined}
      description={
        <Stack spacing={1} direction="column">
          {description.map((block) => (
            <Typography key={block}>{block}</Typography>
          ))}
        </Stack>
      }
    >
      {isLoading ? (
        <Skeleton variant="rectangular" height={400} />
      ) : (
        <DataProductsTable dataProducts={dataProducts} standalone onTrack={handleTrack} />
      )}
    </PanelListLandingPage>
  );
}

export default IntegratedMaps;
