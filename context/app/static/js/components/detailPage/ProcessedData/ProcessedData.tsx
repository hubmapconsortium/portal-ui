import React from 'react';
import { useProcessedDatasets } from 'js/pages/Dataset/hooks';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import ProcessedDataset from './ProcessedDataset';
import { SectionDescription } from './ProcessedDataset/SectionDescription';
import HelperPanel from './HelperPanel';
import { useSortedSearchHits } from './hooks';
import CollapsibleDetailPageSection from '../DetailPageSection/CollapsibleDetailPageSection';

function ProcessedDataSection() {
  const processedDatasets = useProcessedDatasets();
  const sortedSearchHits = useSortedSearchHits(processedDatasets.searchHits);

  const pipelines = processedDatasets?.searchHits.map((dataset) => dataset._source.pipeline);
  const pipelinesText = `Pipelines (${pipelines.length})`;

  return (
    <CollapsibleDetailPageSection
      id="processed-data"
      data-testid="processed-data"
      title="Processed Data"
      icon={sectionIconMap['processed-data']}
    >
      <SectionDescription
        addendum={<LabelledSectionText label={pipelinesText}>{pipelines.join(', ')}</LabelledSectionText>}
      >
        This section contains the results of any additional analyses performed on this dataset. Additional data may
        include visualizations and essential data files (data products). Analysis results could be generated from
        consortium standardized pipelines or by external groups, and may have been generated independently from the
        primary data submitted by the original group.
      </SectionDescription>
      {sortedSearchHits.map((dataset) => (
        <ProcessedDataset sectionDataset={dataset._source} key={dataset._id} isLoading={processedDatasets.isLoading} />
      ))}
      <HelperPanel />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(ProcessedDataSection);