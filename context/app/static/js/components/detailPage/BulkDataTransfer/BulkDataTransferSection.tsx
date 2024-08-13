import React, { useState } from 'react';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import DetailPageSection from 'js/components/detailPage/DetailPageSection';
import { FilesContextProvider } from 'js/components/detailPage/files/FilesContext';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { SectionDescription } from '../ProcessedData/ProcessedDataset/SectionDescription';
import BulkDataTransferPanels from './BulkDataTransferPanels';
import { useProcessedDatasetTabs } from '../ProcessedData/ProcessedDataset/hooks';
import { BULK_DATA_DESCRIPTION_TEXT } from './const';

function BulkDataTransfer() {
  const tabs = useProcessedDatasetTabs();

  const [openTabIndex, setOpenTabIndex] = useState(0);

  return (
    <FilesContextProvider>
      <DetailPageSection id="bulk-data-transfer" data-testid="bulk-data-transfer">
        <SectionHeader>Bulk Data Transfer</SectionHeader>
        <SectionDescription>{BULK_DATA_DESCRIPTION_TEXT}</SectionDescription>
        <Tabs
          value={openTabIndex}
          onChange={(_, newValue) => {
            setOpenTabIndex(newValue as number);
          }}
        >
          {tabs.map(({ label, icon: Icon }, index) => (
            <Tab key={label} label={label} index={index} icon={Icon ? <Icon /> : undefined} iconPosition="start" />
          ))}
        </Tabs>

        {tabs.map((tab, index) => (
          <TabPanel key={tab.label} index={index} value={openTabIndex}>
            <BulkDataTransferPanels {...tab} />
          </TabPanel>
        ))}
      </DetailPageSection>
    </FilesContextProvider>
  );
}

export default BulkDataTransfer;
