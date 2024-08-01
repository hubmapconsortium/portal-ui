import React, { PropsWithChildren } from 'react';
import { createContext, useContext } from 'js/helpers/context';
import { ProcessedDatasetTypes } from 'js/pages/Dataset/hooks';

export interface ProcessedDataVisualizationProps {
  conf: object;
  dataset: ProcessedDatasetTypes;
  isLoading?: boolean;
}

interface ProcessedDatasetContext extends ProcessedDataVisualizationProps {
  defaultExpanded?: boolean;
}

const ProcessedDatasetContext = createContext<ProcessedDatasetContext>('ProcessedDatasetContext');

export function ProcessedDatasetContextProvider({ children, ...props }: PropsWithChildren<ProcessedDatasetContext>) {
  return <ProcessedDatasetContext.Provider value={props}>{children}</ProcessedDatasetContext.Provider>;
}

export function useProcessedDatasetContext() {
  return useContext(ProcessedDatasetContext);
}
