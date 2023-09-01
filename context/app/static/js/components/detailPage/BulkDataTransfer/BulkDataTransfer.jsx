import React from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import { DetailPageSection } from 'js/components/detailPage/style';
import { useFlaskDataContext } from 'js/components/Contexts';
import { FilesContextProvider } from 'js/components/detailPage/files/FilesContext';
import BulkDataTransferPanels from './BulkDataTransferPanels';
import { StyledContainer } from './style';

function BulkDataTransfer() {
  const {
    entity: { entity_type },
  } = useFlaskDataContext();

  return (
    <FilesContextProvider>
      <DetailPageSection id="bulk-data-transfer" data-testid="bulk-data-transfer">
        <SectionHeader
          iconTooltipText={`Information about how to bulk download all files related to this ${entity_type?.toLowerCase()}.`}
        >
          Bulk Data Transfer
        </SectionHeader>
        <StyledContainer>
          <BulkDataTransferPanels />
        </StyledContainer>
      </DetailPageSection>
    </FilesContextProvider>
  );
}

export default BulkDataTransfer;
