import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { FilesContextProvider } from 'js/components/detailPage/files/FilesContext';
import BulkDataTransferPanels from './BulkDataTransferPanels';
import { StyledContainer } from './style';
import { SectionDescription } from '../ProcessedData/ProcessedDataset/SectionDescription';

function BulkDataTransfer() {
  return (
    <FilesContextProvider>
      <DetailPageSection id="bulk-data-transfer" data-testid="bulk-data-transfer">
        <SectionHeader>Bulk Data Transfer</SectionHeader>
        <SectionDescription>
          This section explains how to download data in bulk from raw and processed datasets. Processed datasets have
          separate download directories in Globus or dbGaP, distinct from the raw dataset.
        </SectionDescription>
        <StyledContainer>
          <BulkDataTransferPanels />
        </StyledContainer>
      </DetailPageSection>
    </FilesContextProvider>
  );
}

export default BulkDataTransfer;
