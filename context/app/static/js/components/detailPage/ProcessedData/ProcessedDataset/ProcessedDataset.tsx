import React from 'react';

import FactCheckRounded from '@mui/icons-material/FactCheckRounded';
import SummarizeRounded from '@mui/icons-material/SummarizeRounded';
import AttributionRoundedIcon from '@mui/icons-material/AttributionRounded';
import InsertDriveFileRounded from '@mui/icons-material/InsertDriveFileRounded';
import CloudDownloadRounded from '@mui/icons-material/CloudDownloadRounded';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEventCallback } from '@mui/material/utils';

import { InternalLink } from 'js/shared-styles/Links';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { VisualizationIcon } from 'js/shared-styles/icons';
import { useVitessceConf } from 'js/pages/Dataset/hooks';
import { isSupport } from 'js/components/types';
import { useFlaskDataContext } from 'js/components/Contexts';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import ContributorsTable from 'js/components/detailPage/ContributorsTable';
import { DatasetAttributionDescription } from 'js/components/detailPage/Attribution/Attribution';
import VisualizationWrapper from 'js/components/detailPage/visualization/VisualizationWrapper';
import AnalysisDetails from 'js/components/detailPage/AnalysisDetails';
// import Protocol from 'js/components/detailPage/Protocol';
import { useSelectedVersionStore } from 'js/components/detailPage/VersionSelect/SelectedVersionStore';
import { useVersions } from 'js/components/detailPage/VersionSelect/hooks';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import ProcessedDataGroup from 'js/components/detailPage/ProcessedData/ProcessedDatasetGroup';
import FilesTabs from 'js/components/detailPage/files/FilesTabs';
import { getEntityCreationInfo } from 'js/helpers/functions';
import { trackEvent } from 'js/helpers/trackers';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';

import useProcessedDataStore from '../store';
import { DatasetTitle } from './DatasetTitle';
import { ProcessedDatasetAccordion } from './ProcessedDatasetAccordion';
import { Subsection } from './Subsection';
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
  const { group_name, mapped_consortium, creation_action } = dataset;
  const { creationLabel, creationDate } = getEntityCreationInfo(dataset);

  return (
    <Subsection title="Summary" icon={<SummarizeRounded />}>
      <Stack spacing={1}>
        <ProcessedDatasetDescription />
        <LabelledSectionText label="Group">
          <ProcessedDataGroup creation_action={creation_action} group_name={group_name} />
        </LabelledSectionText>
        <LabelledSectionText label="Consortium">{mapped_consortium}</LabelledSectionText>
        <Contact />
        <LabelledSectionText label={creationLabel}>{creationDate}</LabelledSectionText>
      </Stack>
    </Subsection>
  );
}

function FilesAccordion() {
  const {
    dataset: { files, hubmap_id, uuid },
  } = useProcessedDatasetContext();
  const track = useTrackEntityPageEvent();

  const handleTrack = useEventCallback(() => {
    track({
      action: 'Navigate to Bulk Download',
      label: hubmap_id,
    });
  });

  if (!files || files.length === 0) {
    return (
      <Subsection title="Files" icon={<InsertDriveFileRounded />}>
        <SectionDescription subsection>
          Files are available via{' '}
          <InternalLink onClick={handleTrack} href="#bulk-data-transfer">
            bulk data transfer.
          </InternalLink>
        </SectionDescription>
        <Button
          startIcon={<CloudDownloadRounded />}
          variant="contained"
          href="#bulk-data-transfer"
          onClick={handleTrack}
        >
          Scroll to Bulk Data Transfer
        </Button>
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
      <FilesTabs files={files} uuid={uuid} hubmap_id={hubmap_id} track={trackEvent} />
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
        trackingInfo={{ action: 'Vitessce' }}
        uuid={uuid}
        shouldDisplayHeader={false}
        hasBeenMounted={hasBeenSeen}
        hasNotebook
      />
    </Subsection>
  );
}

// TODO: Revisit broken protocols
function AnalysisDetailsAccordion() {
  const { dataset } = useProcessedDatasetContext();

  if (!dataset) {
    return <Skeleton variant="rectangular" height={200} />;
  }

  if (!dataset.ingest_metadata) {
    return (
      <Subsection
        title="Protocols & Workflow Details"
        idTitleOverride="protocols-and-workflow-details"
        icon={<FactCheckRounded />}
      >
        <SectionDescription subsection>
          Analysis details and protocols are not available for this dataset.
        </SectionDescription>
      </Subsection>
    );
  }

  const {
    ingest_metadata: { dag_provenance_list, workflow_description, workflow_version },
    // protocol_url,
  } = dataset;

  return (
    <Subsection
      title="Protocols & Workflow Details"
      idTitleOverride="protocols-and-workflow-details"
      icon={<FactCheckRounded />}
    >
      {/* Boolean(protocol_url) && <Protocol protocol_url={protocol_url} /> */}
      <AnalysisDetails
        dagListData={dag_provenance_list}
        workflow_description={workflow_description}
        workflow_version={workflow_version}
      />
    </Subsection>
  );
}

function AttributionAccordion() {
  const {
    dataset: { creation_action, contributors, contacts },
  } = useProcessedDatasetContext();

  if (creation_action === 'Central Process' || !contributors?.length) {
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
