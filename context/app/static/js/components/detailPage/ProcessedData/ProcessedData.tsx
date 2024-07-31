import React from 'react';
import { useProcessedDatasets } from 'js/pages/Dataset/hooks';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { InfoIcon } from 'js/shared-styles/icons';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { DetailPageSection } from '../style';
import ProcessedDataset from './ProcessedDataset';

function ProcessedDataSection() {
  const processedDatasets = useProcessedDatasets();

  const pipelines = processedDatasets?.searchHits.map((dataset) => dataset._source.pipeline);
  const pipelinesText = `Pipelines (${pipelines.length})`;

  return (
    <DetailPageSection id="processed-data" data-testid="processed-data">
      <SectionHeader>Processed Data</SectionHeader>
      <DetailSectionPaper>
        <Stack direction="column" gap={1}>
          <Stack direction="row" gap={0.5}>
            <InfoIcon color="primary" fontSize="1.5rem" />
            <Typography variant="body1">
              This section contains the results of any additional analyses performed on this dataset. Additional data
              may include visualizations and essential data files (data products). Analysis results could be generated
              from consortium standardized pipelines or by external groups, and may have been generated independently
              from the primary data submitted by the original group.
            </Typography>
          </Stack>
          <LabelledSectionText label={pipelinesText}>{pipelines.join(', ')}</LabelledSectionText>
        </Stack>
      </DetailSectionPaper>
      {processedDatasets.searchHits.map((dataset) => (
        <ProcessedDataset
          dataset={dataset._source}
          conf={processedDatasets.confs.get(dataset._id)!}
          key={dataset._id}
          isLoading={processedDatasets.isLoading}
        />
      ))}
    </DetailPageSection>
  );
}

export default ProcessedDataSection;
