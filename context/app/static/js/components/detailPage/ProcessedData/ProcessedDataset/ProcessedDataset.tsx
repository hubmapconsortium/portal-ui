import React, { useState } from 'react';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { formatDate } from 'date-fns/format';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tabs';
import FactCheckRounded from '@mui/icons-material/FactCheckRounded';
import SummarizeRounded from '@mui/icons-material/SummarizeRounded';
import InsertDriveFileRounded from '@mui/icons-material/InsertDriveFileRounded';
import { VisualizationIcon } from 'js/shared-styles/icons';
import { useInView } from 'react-intersection-observer';
import { useVitessceConf } from 'js/pages/Dataset/hooks';
import { isSupport } from 'js/components/types';
import { useFlaskDataContext } from 'js/components/Contexts';
import Skeleton from '@mui/material/Skeleton';
import Files from '../../files/Files';
import DataProducts from '../../files/DataProducts';
import VisualizationWrapper from '../../visualization/VisualizationWrapper';
import AnalysisDetails from '../../AnalysisDetails';
import Protocol from '../../Protocol';
import { DatasetTitle } from './DatasetTitle';
import { ProcessedDatasetAccordion } from './ProcessedDatasetAccordion';
import { Subsection } from './Subsection';
import { SectionDescription } from './SectionDescription';
import useProcessedDataStore from '../store';
import { getDateLabelAndValue } from '../../utils';
import {
  ProcessedDatasetContextProvider,
  useProcessedDatasetContext,
  ProcessedDataVisualizationProps,
} from './ProcessedDatasetContext';
import { useSelectedVersionStore } from '../../VersionSelect/SelectedVersionStore';
import { useProcessedDatasetDetails } from './hooks';
import { useVersions } from '../../VersionSelect/hooks';

function ProcessedDatasetDescription() {
  const {
    dataset: { description, title },
  } = useProcessedDatasetContext();

  if (!description) {
    return <LabelledSectionText label="Title">{title}</LabelledSectionText>;
  }

  return <LabelledSectionText label="Description">{description}</LabelledSectionText>;
}

function RegisteredBy() {
  const {
    dataset: { created_by_user_displayname, created_by_user_email },
  } = useProcessedDatasetContext();
  return (
    <LabelledSectionText label="Registered By">
      {created_by_user_displayname} <br />
      <EmailIconLink email={created_by_user_displayname}>{created_by_user_email}</EmailIconLink>
    </LabelledSectionText>
  );
}

function SummaryAccordion() {
  const { dataset } = useProcessedDatasetContext();
  const [dateLabel, dateValue] = getDateLabelAndValue(dataset);
  return (
    <Subsection id={`summary-${dataset.hubmap_id}`} title="Summary" icon={<SummarizeRounded />}>
      <ProcessedDatasetDescription />
      <LabelledSectionText label="Consortium">{dataset.group_name}</LabelledSectionText>
      <RegisteredBy />
      <LabelledSectionText label={dateLabel}>
        {dateValue ? formatDate(new Date(dateValue), 'yyyy-MM-dd') : 'N/A'}
      </LabelledSectionText>
    </Subsection>
  );
}

function FilesAccordion() {
  const {
    dataset: { files, hubmap_id },
  } = useProcessedDatasetContext();
  const id = `files-${hubmap_id}`;
  const hasDataProducts = Boolean(files.filter((file) => file.is_data_product).length);
  const [openTabIndex, setOpenTabIndex] = useState(0);
  const fileBrowserIndex = hasDataProducts ? 1 : 0;
  return (
    <Subsection id={id} title="Files" icon={<InsertDriveFileRounded />}>
      <SectionDescription subsection>
        Files are available for this processed dataset. Essential data products are identified for your convenience, and
        a comprehensive list of available files is displayed in the file browser. To download data in bulk from either
        the processed or the primary dataset, navigate to the bulk data transfer section.
      </SectionDescription>
      <Tabs value={openTabIndex} onChange={(_, newValue) => setOpenTabIndex(newValue as number)}>
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
    <Subsection id={`visualization-${hubmap_id}`} title="Visualization" icon={<VisualizationIcon />}>
      <SectionDescription subsection>
        This visualization includes various interactive elements such as scatter plots, spatial imaging plots, heat
        maps, genome browser tracks, and more.
      </SectionDescription>
      <VisualizationWrapper vitData={conf} uuid={uuid} shouldDisplayHeader={false} hasBeenMounted={hasBeenSeen} />
    </Subsection>
  );
}

function AnalysisDetailsAccordion() {
  const { dataset } = useProcessedDatasetContext();

  if (!dataset) {
    return <Skeleton variant="rectangular" height={200} />;
  }

  const {
    hubmap_id,
    metadata: { dag_provenance_list },
    protocol_url,
  } = dataset;

  return (
    <Subsection id={`analysis-${hubmap_id}`} title="Analysis Details & Protocols" icon={<FactCheckRounded />}>
      <AnalysisDetails dagListData={dag_provenance_list} />
      {Boolean(protocol_url) && <Protocol protocol_url={protocol_url} />}
    </Subsection>
  );
}

export default function ProcessedDataset({ sectionDataset }: ProcessedDataVisualizationProps) {
  const selectedDatasetVersionUUID =
    useSelectedVersionStore((state) => state.selectedVersions.get(sectionDataset.uuid))?.uuid ?? sectionDataset.uuid;

  const { datasetDetails, isLoading } = useProcessedDatasetDetails(selectedDatasetVersionUUID);
  useVersions(sectionDataset.uuid);

  const { setCurrentDataset } = useProcessedDataStore((state) => ({
    setCurrentDataset: state.setCurrentDataset,
  }));
  const { ref } = useInView({
    threshold: 0.1,
    initialInView: false,
    onChange: (visible) => {
      if (visible && datasetDetails) {
        setCurrentDataset(datasetDetails);
      }
    },
  });
  const { entity: parent } = useFlaskDataContext();

  const { data: conf, isLoading: loadingVitessceConf } = useVitessceConf(
    selectedDatasetVersionUUID,
    isSupport(sectionDataset) ? parent.uuid : undefined,
  );

  const defaultExpanded = sectionDataset.status === 'Published';

  return (
    <div ref={ref}>
      <ProcessedDatasetContextProvider
        conf={conf}
        dataset={datasetDetails}
        sectionDataset={sectionDataset}
        isLoading={isLoading || loadingVitessceConf}
        defaultExpanded={defaultExpanded}
      >
        <ProcessedDatasetAccordion>
          <DatasetTitle />
          <SummaryAccordion />
          <VisualizationAccordion />
          <FilesAccordion />
          <AnalysisDetailsAccordion />
        </ProcessedDatasetAccordion>
      </ProcessedDatasetContextProvider>
    </div>
  );
}
