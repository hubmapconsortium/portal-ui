import React, { PropsWithChildren } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import { ProcessedDatasetInfo } from 'js/pages/Dataset/hooks';
import { ProcessedDatasetDetails } from './hooks';

export interface ProcessedDataVisualizationProps {
  sectionDataset: ProcessedDatasetInfo;
  isLoading?: boolean;
}

interface ProcessedDatasetContext extends ProcessedDataVisualizationProps {
  conf?: object;
  dataset: ProcessedDatasetDetails;
  defaultExpanded?: boolean;
}

const ProcessedDatasetContext = createContext<ProcessedDatasetContext>('ProcessedDatasetContext');

export function ProcessedDatasetContextProvider({ children, ...props }: PropsWithChildren<ProcessedDatasetContext>) {
  return <ProcessedDatasetContext.Provider value={props}>{children}</ProcessedDatasetContext.Provider>;
}

export function useProcessedDatasetContext() {
  return useContext(ProcessedDatasetContext);
}
