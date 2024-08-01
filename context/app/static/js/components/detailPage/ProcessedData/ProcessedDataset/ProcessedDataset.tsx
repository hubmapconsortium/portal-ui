import React, { useState } from 'react';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { ProcessedDatasetTypes } from 'js/pages/Dataset/hooks';
import { formatDate } from 'date-fns/format';
import { Tabs, Tab, TabPanel } from 'js/shared-styles/tabs';
import FactCheckRounded from '@mui/icons-material/FactCheckRounded';
import SummarizeRounded from '@mui/icons-material/SummarizeRounded';
import InsertDriveFileRounded from '@mui/icons-material/InsertDriveFileRounded';
import { VisualizationIcon } from 'js/shared-styles/icons';
import { useInView } from 'react-intersection-observer';
import Files from '../../files/Files';
import DataProducts from '../../files/DataProducts';
import VisualizationWrapper from '../../visualization/VisualizationWrapper';
import AnalysisDetails from '../../AnalysisDetails';
import Protocol from '../../Protocol';
import { ProcessedDataVisualizationProps } from './types';
import { DatasetTitle } from './DatasetTitle';
import { ProcessedDatasetAccordion } from './ProcessedDatasetAccordion';
import { Subsection } from './Subsection';
import { SectionDescription } from './SectionDescription';
import useProcessedDataStore from '../store';
import { getDateLabelAndValue } from '../../utils';

function ProcessedDatasetDescription({ description, title }: Pick<ProcessedDatasetTypes, 'description' | 'title'>) {
  if (!description) {
    return <LabelledSectionText label="Title">{title}</LabelledSectionText>;
  }

  return <LabelledSectionText label="Description">{description}</LabelledSectionText>;
}

function RegisteredBy({
  created_by_user_displayname,
  created_by_user_email,
}: Pick<ProcessedDatasetTypes, 'created_by_user_displayname' | 'created_by_user_email'>) {
  return (
    <LabelledSectionText label="Registered By">
      {created_by_user_displayname} <br />
      <EmailIconLink email={created_by_user_displayname}>{created_by_user_email}</EmailIconLink>
    </LabelledSectionText>
  );
}

function SummaryAccordion({ dataset }: Pick<ProcessedDataVisualizationProps, 'dataset'>) {
  const [dateLabel, dateValue] = getDateLabelAndValue(dataset);
  return (
    <Subsection id={`summary-${dataset.hubmap_id}`} title="Summary" icon={<SummarizeRounded />}>
      <ProcessedDatasetDescription description={dataset.description} title={dataset.title} />
      <LabelledSectionText label="Consortium">{dataset.group_name}</LabelledSectionText>
      <RegisteredBy
        created_by_user_displayname={dataset.created_by_user_displayname}
        created_by_user_email={dataset.created_by_user_email}
      />
      <LabelledSectionText label={dateLabel}>
        {dateValue ? formatDate(new Date(dateValue), 'yyyy-MM-dd') : 'N/A'}
      </LabelledSectionText>
    </Subsection>
  );
}

function FilesAccordion({ dataset }: Pick<ProcessedDataVisualizationProps, 'dataset'>) {
  const [openTabIndex, setOpenTabIndex] = useState(0);
  const { files, hubmap_id } = dataset;
  const id = `files-${hubmap_id}`;
  return (
    <Subsection id={id} title="Files" icon={<InsertDriveFileRounded />}>
      <SectionDescription subsection>
        Files are available for this processed dataset. Essential data products are identified for your convenience, and
        a comprehensive list of available files is displayed in the file browser. To download data in bulk from either
        the processed or the primary dataset, navigate to the bulk data transfer section.
      </SectionDescription>
      <Tabs value={openTabIndex} onChange={(_, newValue) => setOpenTabIndex(newValue as number)}>
        <Tab label="Data Products" index={0} />
        <Tab label="File Browser" index={1} />
      </Tabs>
      <TabPanel value={openTabIndex} index={0}>
        <DataProducts files={files} />
      </TabPanel>
      <TabPanel value={openTabIndex} index={1}>
        <Files files={files} />
      </TabPanel>
    </Subsection>
  );
}

function VisualizationAccordion({ conf, dataset }: Pick<ProcessedDataVisualizationProps, 'dataset' | 'conf'>) {
  const { hubmap_id, uuid } = dataset;

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

function AnalysisDetailsAccordion({ dataset }: Pick<ProcessedDataVisualizationProps, 'dataset'>) {
  return (
    <Subsection id={`analysis-${dataset.hubmap_id}`} title="Analysis Details & Protocols" icon={<FactCheckRounded />}>
      <AnalysisDetails dagListData={dataset.metadata.dag_provenance_list} />
      {Boolean(dataset.protocol_url) && <Protocol protocol_url={dataset.protocol_url} />}
    </Subsection>
  );
}

export default function ProcessedDataset({ conf, dataset, isLoading }: ProcessedDataVisualizationProps) {
  const { setCurrentDataset } = useProcessedDataStore((state) => ({
    setCurrentDataset: state.setCurrentDataset,
  }));
  const { ref } = useInView({
    threshold: 0.1,
    initialInView: false,
    onChange: (visible) => {
      if (visible) {
        setCurrentDataset(dataset);
      }
    },
  });

  return (
    <div ref={ref}>
      <ProcessedDatasetAccordion dataset={dataset} conf={conf} isLoading={isLoading}>
        <DatasetTitle hubmap_id={dataset.hubmap_id} status={dataset.status} />
        <SummaryAccordion dataset={dataset} />
        <VisualizationAccordion dataset={dataset} conf={conf} />
        <FilesAccordion dataset={dataset} />
        <AnalysisDetailsAccordion dataset={dataset} />
      </ProcessedDatasetAccordion>
    </div>
  );
}
