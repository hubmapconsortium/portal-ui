import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { FilesContextProvider } from 'js/components/detailPage/files/FilesContext';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tables/TableTabs';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { OutboundLink } from 'js/shared-styles/Links';
import withShouldDisplay from 'js/helpers/withShouldDisplay';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import BulkDownloadTextButton from 'js/components/bulkDownload/buttons/BulkDownloadTextButton';
import { LINKS } from 'js/components/bulkDownload/constants';
import BulkDownloadSuccessAlert from 'js/components/bulkDownload/BulkDownloadSuccessAlert';
import BulkDataTransferPanels from './BulkDataTransferPanels';
import { useProcessedDatasetTabs } from '../ProcessedData/ProcessedDataset/hooks';

const description = (
  <Typography>
    This section explains how to bulk download the raw and processed data for this dataset. Files for individual raw or
    processed data can be downloaded via Globus or dbGaP from the respective tabs. To download files from multiple
    Globus directories simultaneously, use the
    <OutboundLink href={LINKS.documentation}> HuBMAP Command Line Transfer (CLT) Tool</OutboundLink>. Note that
    processed data has separate download directories in Globus or dbGaP, distinct from the raw data directory.
  </Typography>
);

function BulkDataTransfer() {
  const tabs = useProcessedDatasetTabs();
  const uuids = new Set(tabs.map((tab) => tab.uuid));

  const [openTabIndex, setOpenTabIndex] = useState(0);

  return (
    <CollapsibleDetailPageSection
      id="bulk-data-transfer"
      data-testid="bulk-data-transfer"
      title="Bulk Data Transfer"
      icon={sectionIconMap['bulk-data-transfer']}
    >
      <FilesContextProvider>
        <BulkDownloadSuccessAlert />
        <SectionDescription>
          <Stack spacing={1}>
            {description}
            <BulkDownloadTextButton uuids={uuids} />
          </Stack>
        </SectionDescription>
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
            <DetailSectionPaper>
              <BulkDataTransferPanels {...tab} />
            </DetailSectionPaper>
          </TabPanel>
        ))}
      </FilesContextProvider>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(BulkDataTransfer);
