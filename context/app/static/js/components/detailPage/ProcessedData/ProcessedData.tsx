import React from 'react';
import { useProcessedDatasets } from 'js/pages/Dataset/hooks';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import ProcessedDataset from './ProcessedDataset';
import { SectionDescription } from './ProcessedDataset/SectionDescription';
import HelperPanel from './HelperPanel';
import { usePipelineCountsInfo, useSortedSearchHits } from './hooks';
import CollapsibleDetailPageSection from '../DetailPageSection/CollapsibleDetailPageSection';

function ProcessedDataSection() {
  const processedDatasets = useProcessedDatasets();
  const sortedSearchHits = useSortedSearchHits(processedDatasets.searchHits);

  const { pipelinesText, pipelineCountsText } = usePipelineCountsInfo(
    processedDatasets.searchHits.map((dataset) => dataset._source),
  );

  return (
    <CollapsibleDetailPageSection
      id="processed-data"
      data-testid="processed-data"
      title="Processed Data"
      icon={sectionIconMap['processed-data']}
    >
      <SectionDescription
        addendum={<LabelledSectionText label={pipelinesText}>{pipelineCountsText}</LabelledSectionText>}
      >
        This section lists analyses generated based on this dataset. These analyses are represented as processed
        datasets and are either generated by HuBMAP using uniform processing pipelines or by an external processing
        approach. For questions regarding an analysis, refer to the contact information for the processed data.
      </SectionDescription>
      {sortedSearchHits.map((dataset) => (
        <ProcessedDataset sectionDataset={dataset._source} key={dataset._id} isLoading={processedDatasets.isLoading} />
      ))}
      <HelperPanel />
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(ProcessedDataSection);
