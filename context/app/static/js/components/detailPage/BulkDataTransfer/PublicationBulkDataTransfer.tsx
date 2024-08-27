import React from 'react';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { FilesContextProvider } from 'js/components/detailPage/files/FilesContext';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import BulkDataTransferPanels from './BulkDataTransferPanels';

// Workaround for publication pages, which only have one BulkDataTransfer section and doesn't need tabs.
// For the dataset page's BulkDataTransfer section, see BulkDataTransferSection.tsx
function BulkDataTransfer(props: { uuid: string; label: string }) {
  return (
    <CollapsibleDetailPageSection
      id="bulk-data-transfer"
      data-testid="bulk-data-transfer"
      title="Bulk Data Transfer"
      icon={sectionIconMap['bulk-data-transfer']}
    >
      <FilesContextProvider>
        <BulkDataTransferPanels {...props} />
      </FilesContextProvider>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(BulkDataTransfer);
