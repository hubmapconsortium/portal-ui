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
import Files from '../../files/Files';
import DataProducts from '../../files/DataProducts';
import VisualizationWrapper from '../../visualization/VisualizationWrapper';
import AnalysisDetails from '../../AnalysisDetails';
import Protocol from '../../Protocol';
import { ProcessedDataVisualizationProps } from './types';
import { DatasetTitle } from './DatasetTitle';
import { ProcessedDatasetAccordion } from './ProcessedDatasetAccordion';
import { Subsection } from './Subsection';

function ProcessedDatasetDescription({
  description: _description,
  title,
}: Pick<ProcessedDatasetTypes, 'description' | 'title'>) {
  const descriptionTitle = _description ? 'Description' : 'Title';
  const description = _description ?? title;
  if (!description) {
    return null;
  }
  return <LabelledSectionText label={descriptionTitle}>{description}</LabelledSectionText>;
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
  return (
    <Subsection id={`summary-${dataset.hubmap_id}`} title="Summary" icon={<SummarizeRounded />}>
      <ProcessedDatasetDescription description={dataset.description} title={dataset.title} />
      <LabelledSectionText label="Consortium">{dataset.group_name}</LabelledSectionText>
      <RegisteredBy
        created_by_user_displayname={dataset.created_by_user_displayname}
        created_by_user_email={dataset.created_by_user_email}
      />
      <LabelledSectionText label="Publication Date">
        {dataset.published_timestamp ? formatDate(dataset.published_timestamp, 'yyyy-MM-dd') : 'N/A'}
      </LabelledSectionText>
    </Subsection>
  );
}

function FilesAccordion({ files, id }: Pick<ProcessedDatasetTypes, 'files'> & { id: string }) {
  const [openTabIndex, setOpenTabIndex] = useState(0);

  return (
    <Subsection id={id} title="Files" icon={<InsertDriveFileRounded />}>
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

function VisualizationAccordion({
  conf,
  dataset: { hubmap_id, uuid },
}: Pick<ProcessedDataVisualizationProps, 'dataset' | 'conf'>) {
  return (
    <Subsection id={`visualization-${hubmap_id}`} title="Visualization" icon={<VisualizationIcon />}>
      <VisualizationWrapper vitData={conf} uuid={uuid} shouldDisplayHeader={false} />
    </Subsection>
  );
}

function AnalysisDetailsAccordion({ dataset }: Pick<ProcessedDataVisualizationProps, 'dataset'>) {
  return (
    <Subsection id={`protocols-${dataset.hubmap_id}`} title="Analysis Details & Protocols" icon={<FactCheckRounded />}>
      <AnalysisDetails dagListData={dataset.metadata.dag_provenance_list} />
      {Boolean(dataset.protocol_url) && <Protocol protocol_url={dataset.protocol_url} />}
    </Subsection>
  );
}

export default function ProcessedDataset({ conf, dataset, isLoading }: ProcessedDataVisualizationProps) {
  return (
    <ProcessedDatasetAccordion dataset={dataset} conf={conf} isLoading={isLoading}>
      <DatasetTitle hubmap_id={dataset.hubmap_id} status={dataset.status} />
      <SummaryAccordion dataset={dataset} />
      <VisualizationAccordion dataset={dataset} conf={conf} />
      <FilesAccordion files={dataset.files} id={`files-${dataset.hubmap_id}`} />
      <AnalysisDetailsAccordion dataset={dataset} />
    </ProcessedDatasetAccordion>
  );
}
