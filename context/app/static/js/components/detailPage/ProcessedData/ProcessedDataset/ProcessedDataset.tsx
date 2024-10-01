import React, { useState } from 'react';
import { formatDate } from 'date-fns/format';

import FactCheckRounded from '@mui/icons-material/FactCheckRounded';
import SummarizeRounded from '@mui/icons-material/SummarizeRounded';
import AttributionRoundedIcon from '@mui/icons-material/AttributionRounded';
import InsertDriveFileRounded from '@mui/icons-material/InsertDriveFileRounded';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tabs';
import { VisualizationIcon } from 'js/shared-styles/icons';
import { useVitessceConf } from 'js/pages/Dataset/hooks';
import { isSupport } from 'js/components/types';
import { useFlaskDataContext } from 'js/components/Contexts';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import { DatasetAttributionDescription } from 'js/components/detailPage/Attribution/Attribution';
import Files from 'js/components/detailPage/files/Files';
import DataProducts from 'js/components/detailPage/files/DataProducts';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import AnalysisDetails from 'js/components/detailPage/AnalysisDetails';
import Protocol from 'js/components/detailPage/Protocol';
import { getDateLabelAndValue } from 'js/components/detailPage/utils';
import { useSelectedVersionStore } from 'js/components/detailPage/VersionSelect/SelectedVersionStore';
import { useVersions } from 'js/components/detailPage/VersionSelect/hooks';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';

import { DatasetTitle } from './DatasetTitle';
import { ProcessedDatasetAccordion } from './ProcessedDatasetAccordion';
import { Subsection } from './Subsection';
import { SectionDescription } from './SectionDescription';
import useProcessedDataStore from '../store';
import {
  ProcessedDatasetContextProvider,
  useProcessedDatasetContext,
  ProcessedDataVisualizationProps,
} from './ProcessedDatasetContext';
import { useProcessedDatasetDetails } from './hooks';
import { OldVersionAlert } from './OldVersionAlert';

function ProcessedDatasetDescription() {
  const {
    dataset: { description, title },
  } = useProcessedDatasetContext();

  if (!description) {
    return <LabelledSectionText label="Title">{title}</LabelledSectionText>;
  }

  return <LabelledSectionText label="Description">{description}</LabelledSectionText>;
}

function Contact() {
  const {
    dataset: { creation_action },
  } = useProcessedDatasetContext();

  if (creation_action !== 'Central Process') {
    return null;
  }

  return (
    <LabelledSectionText label="Contact" iconTooltipText="This is the contact for this data.">
      <ContactUsLink>HuBMAP Help Desk</ContactUsLink>
    </LabelledSectionText>
  );
}

function SummaryAccordion() {
  const { dataset } = useProcessedDatasetContext();
  const [dateLabel, dateValue] = getDateLabelAndValue(dataset);
  return (
    <Subsection title="Summary" icon={<SummarizeRounded />}>
      <Stack spacing={1}>
        <ProcessedDatasetDescription />
        <LabelledSectionText label="Group">{dataset.group_name}</LabelledSectionText>
        <LabelledSectionText label="Consortium">{dataset.mapped_consortium}</LabelledSectionText>
        <Contact />
        <LabelledSectionText label={dateLabel}>
          {dateValue ? formatDate(new Date(dateValue), 'yyyy-MM-dd') : 'N/A'}
        </LabelledSectionText>
      </Stack>
    </Subsection>
  );
}

function FilesAccordion() {
  const {
    dataset: { files, hubmap_id },
  } = useProcessedDatasetContext();
  const hasDataProducts = Boolean(files.filter((file) => file.is_data_product).length);
  const [openTabIndex, setOpenTabIndex] = useState(0);
  const fileBrowserIndex = hasDataProducts ? 1 : 0;
  const track = useTrackEntityPageEvent();
  if (files.length === 0) {
    return (
      <Subsection title="Files" icon={<InsertDriveFileRounded />}>
        <SectionDescription subsection>No files are available for this dataset.</SectionDescription>
      </Subsection>
    );
  }
  return (
    <Subsection title="Files" icon={<InsertDriveFileRounded />}>
      <SectionDescription subsection>
        Files are available for this processed dataset. Essential data products are identified for your convenience, and
        a comprehensive list of available files is displayed in the file browser. To download data in bulk from either
        the processed or the primary dataset, navigate to the bulk data transfer section.
      </SectionDescription>
      <Tabs
        value={openTabIndex}
        onChange={(_, newValue) => {
          setOpenTabIndex(newValue as number);
          track({
            action: `Change to ${newValue === fileBrowserIndex ? 'File Browser' : 'Data Products'} Tab`,
            label: hubmap_id,
          });
        }}
      >
        {hasDataProducts && <Tab label="Data Products" index={0} />}
        <Tab label="File Browser" index={fileBrowserIndex} />
      </Tabs>
      {hasDataProducts && (
        <TabPanel value={openTabIndex} index={0}>
          <DataProducts files={files} />
        </TabPanel>
      )}
      <TabPanel value={openTabIndex} index={fileBrowserIndex}>
        <Files files={files} />
      </TabPanel>
    </Subsection>
  );
}

function VisualizationAccordion() {
  const {
    dataset: { uuid },
    sectionDataset: { hubmap_id },
    conf,
  } = useProcessedDatasetContext();

  const hasBeenSeen = useProcessedDataStore((state) => state.hasBeenSeen(hubmap_id));

  if (!conf) {
    return null;
  }

  return (
    <Subsection title="Visualization" icon={<VisualizationIcon />}>
      <SectionDescription subsection>
        This visualization includes various interactive elements such as scatter plots, spatial imaging plots, heat
        maps, genome browser tracks, and more.
      </SectionDescription>
      <VisualizationWrapper
        vitData={conf}
        uuid={uuid}
        shouldDisplayHeader={false}
        hasBeenMounted={hasBeenSeen}
        hasNotebook
      />
    </Subsection>
  );
}

function AnalysisDetailsAccordion() {
  const { dataset } = useProcessedDatasetContext();

  if (!dataset) {
    return <Skeleton variant="rectangular" height={200} />;
  }

  if (!dataset.metadata) {
    return (
      <Subsection title="Analysis Details & Protocols" idTitleOverride="analysis" icon={<FactCheckRounded />}>
        <SectionDescription subsection>
          Analysis details and protocols are not available for this dataset.
        </SectionDescription>
      </Subsection>
    );
  }

  const {
    metadata: { dag_provenance_list },
    protocol_url,
  } = dataset;

  return (
    <Subsection title="Analysis Details & Protocols" idTitleOverride="analysis" icon={<FactCheckRounded />}>
      <AnalysisDetails dagListData={dag_provenance_list} />
      {Boolean(protocol_url) && <Protocol protocol_url={protocol_url} />}
    </Subsection>
  );
}

function AttributionAccordion() {
  const {
    dataset: { creation_action, contributors, contacts },
  } = useProcessedDatasetContext();

  if (creation_action === 'Central Process' || !Boolean(contributors?.length) {
    return null;
  }

  return (
    <Subsection title="Attribution" idTitleOverride="attribution" icon={<AttributionRoundedIcon />}>
      {DatasetAttributionDescription}
      <ContributorsTable contributors={contributors} contacts={contacts} />
    </Subsection>
  );
}

export default function ProcessedDataset({ sectionDataset }: ProcessedDataVisualizationProps) {
  const selectedDatasetVersionUUID =
    useSelectedVersionStore((state) => state.selectedVersions.get(sectionDataset.uuid))?.uuid ?? sectionDataset.uuid;

  const { datasetDetails, isLoading } = useProcessedDatasetDetails(selectedDatasetVersionUUID);
  useVersions(sectionDataset.uuid);

  const { entity: parent } = useFlaskDataContext();

  const { data: conf, isLoading: loadingVitessceConf } = useVitessceConf(
    selectedDatasetVersionUUID,
    isSupport(sectionDataset) ? parent.uuid : undefined,
  );

  const defaultExpanded = sectionDataset.status === 'Published';

  return (
    <ProcessedDatasetContextProvider
      conf={conf}
      dataset={datasetDetails}
      sectionDataset={sectionDataset}
      isLoading={isLoading || loadingVitessceConf}
      defaultExpanded={defaultExpanded}
    >
      <ProcessedDatasetAccordion>
        <OldVersionAlert />
        <DatasetTitle />
        <SummaryAccordion />
        <VisualizationAccordion />
        <FilesAccordion />
        <AnalysisDetailsAccordion />
        <AttributionAccordion />
      </ProcessedDatasetAccordion>
    </ProcessedDatasetContextProvider>
  );
}
