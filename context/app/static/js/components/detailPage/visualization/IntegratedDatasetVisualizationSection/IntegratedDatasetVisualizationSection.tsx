import React from 'react';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import VisualizationWrapper from '../VisualizationWrapper';
import Description from 'js/shared-styles/sections/Description';
import { Box } from '@mui/system';
import { VisualizationIcon } from 'js/shared-styles/icons';

interface IntegratedDatasetVisualizationProps {
  uuid: string;
  vitessceConfig?: object;
}

const trackingInfo = {
  category: 'Integrated Dataset',
};

function IntegratedDatasetVisualizationSection({ uuid, vitessceConfig }: IntegratedDatasetVisualizationProps) {
  return (
    <CollapsibleDetailPageSection title="Visualization" icon={VisualizationIcon}>
      <Description
        belowTheFold={
          <Box mt={2} width="100%">
            <VisualizationWrapper
              uuid={uuid}
              vitData={vitessceConfig}
              trackingInfo={trackingInfo}
              shouldDisplayHeader={false}
            />
          </Box>
        }
      >
        This visualization includes various interactive elements such as scatterplots, spatial imaging plots, heat maps,
        genome browser tracks, and more.
      </Description>
    </CollapsibleDetailPageSection>
  );
}

export default IntegratedDatasetVisualizationSection;
