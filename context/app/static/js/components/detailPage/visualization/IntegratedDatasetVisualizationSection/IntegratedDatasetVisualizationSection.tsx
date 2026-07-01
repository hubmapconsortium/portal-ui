import React from 'react';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import VisualizationWrapper from '../VisualizationWrapper';
import Description from 'js/shared-styles/sections/Description';
import { Box } from '@mui/system';
import { VisualizationIcon } from 'js/shared-styles/icons';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import SegmentationChannelsAndQuality from 'js/components/detailPage/SegmentationChannelsAndQuality/SegmentationChannelsAndQuality';
import { SegmentationMetadataEntry } from 'js/components/types';

interface IntegratedDatasetVisualizationProps {
  uuid: string;
  vitessceConfig?: object;
  segmentationMetadata?: SegmentationMetadataEntry[];
}

const trackingInfo = {
  action: 'Integrated Dataset Visualization',
  category: 'Integrated Dataset',
};

function IntegratedDatasetVisualizationSection({
  uuid,
  vitessceConfig,
  segmentationMetadata,
}: IntegratedDatasetVisualizationProps) {
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
              hasNotebook
              renderBelowFooter={({ activeConfigName }) => (
                <SegmentationChannelsAndQuality
                  segmentationMetadata={segmentationMetadata}
                  activeConfigName={activeConfigName}
                />
              )}
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

export default withShouldDisplay(IntegratedDatasetVisualizationSection);
