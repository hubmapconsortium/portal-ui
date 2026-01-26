import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEventCallback } from '@mui/material/utils';

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
import SnareSeq2Alert from '../multi-assay/SnareSeq2Alert';
import { useDetailContext } from '../DetailContext';

const description = (
  <Typography>
    This section explains how to bulk download the raw and processed data for this dataset. Files for individual raw or
    processed data can be downloaded via Globus or dbGaP from the respective tabs. To download files from multiple
    Globus directories simultaneously, use the
    <OutboundLink href={LINKS.documentation}> HuBMAP Command Line Transfer (CLT) Tool</OutboundLink>. Note that
    processed data has separate download directories in Globus or dbGaP, distinct from the raw data directory.
  </Typography>
);

const integratedEntityDescription = (
  <Typography>
    This section explains how to bulk download the raw and processed data for the datasets integrated into this entity.
    To download files from multiple Globus directories simultaneously, use the
    <OutboundLink href={LINKS.documentation}> HuBMAP Command Line Transfer (CLT) Tool</OutboundLink>. Note that
    processed data has separate download directories in Globus or dbGaP, distinct from the raw data directory.
  </Typography>
);

const id = 'bulk-data-transfer';

function BulkDataTransferDescription({
  isIntegratedEntity,
  uuids,
}: {
  isIntegratedEntity: boolean;
  uuids: Set<string>;
}) {
  return (
    <SectionDescription>
      <Stack spacing={1}>
        {isIntegratedEntity ? integratedEntityDescription : description}
        <BulkDownloadTextButton uuids={uuids} />
      </Stack>
    </SectionDescription>
  );
}

interface BulkDataTransferProps {
  customUUIDs?: Set<string>;
  integratedEntityUUID?: string;
}

/**
 * Integrated entity bulk data transfer sections display the panels only for the integratedEntityUUID.
 * The BulkDownloadTextButton receives the set of customUUIDs to allow downloading all files from the integrated datasets.
 */
function IntegratedBulkDataTransfer({ integratedEntityUUID, customUUIDs = new Set() }: BulkDataTransferProps) {
  const { entityType } = useDetailContext();

  if (!integratedEntityUUID) {
    throw new Error('Integrated entity UUID is required for IntegratedBulkDataTransfer component');
  }

  return (
    <>
      <BulkDataTransferDescription isIntegratedEntity uuids={customUUIDs} />
      <DetailSectionPaper>
        <BulkDataTransferPanels label={entityType} uuid={integratedEntityUUID} />
      </DetailSectionPaper>
    </>
  );
}

function RegularBulkDataTransfer() {
  const tabs = useProcessedDatasetTabs(true, true);
  const uuids = new Set(tabs.map((tab) => tab.uuid));

  const [openTabIndex, setOpenTabIndex] = useState(0);

  const onChange = useEventCallback((_, newValue) => {
    setOpenTabIndex(newValue as number);
  });

  return (
    <>
      <BulkDataTransferDescription isIntegratedEntity={false} uuids={uuids} />
      <Tabs
        value={openTabIndex}
        onChange={onChange}
        variant={tabs.length > 4 ? 'scrollable' : 'fullWidth'}
        scrollButtons="auto"
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
    </>
  );
}

function BulkDataTransfer({ integratedEntityUUID, customUUIDs }: BulkDataTransferProps) {
  const isIntegratedEntity = Boolean(integratedEntityUUID || (customUUIDs && customUUIDs.size > 0));

  return (
    <CollapsibleDetailPageSection
      id={id}
      data-testid="bulk-data-transfer"
      title="Bulk Data Transfer"
      icon={sectionIconMap[id]}
    >
      <SnareSeq2Alert />
      <FilesContextProvider>
        <BulkDownloadSuccessAlert />
        {isIntegratedEntity ? (
          <IntegratedBulkDataTransfer integratedEntityUUID={integratedEntityUUID} customUUIDs={customUUIDs} />
        ) : (
          <RegularBulkDataTransfer />
        )}
      </FilesContextProvider>
    </CollapsibleDetailPageSection>
  );
}

export default withShouldDisplay(BulkDataTransfer);
