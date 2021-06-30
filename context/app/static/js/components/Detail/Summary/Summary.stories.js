import React from 'react';
import Typography from '@material-ui/core/Typography';

import { Default as DefaultCitation } from 'js/components/Detail/Citation/Citation.stories';
import Summary from './Summary';
import SummaryItem from '../SummaryItem';

export default {
  title: 'EntityDetail/Summary/Summary',
  component: Summary,
};

const sharedArgs = {
  uuid: 'fakeuuid',
  create_timestamp: Date.now(),
  last_modified_timestamp: Date.now(),
  display_doi: 'DOI123',
};

const donorSharedArgs = {
  ...sharedArgs,
  entity_type: 'Donor',
};

const DonorTemplate = (args) => <Summary {...args} />;
export const DonorDefault = DonorTemplate.bind({});
DonorDefault.args = {
  ...donorSharedArgs,
};

export const DonorWithDescription = DonorTemplate.bind({});
DonorWithDescription.args = {
  ...donorSharedArgs,
  description:
    'Fugiat irure nisi ea dolore non adipisicing non. Enim enim incididunt ut reprehenderit esse sint adipisicing. Aliqua excepteur reprehenderit tempor commodo anim veniam laboris labore exercitation qui. Adipisicing pariatur est anim nisi cupidatat ea Lorem nostrud labore laborum enim eiusmod.',
};

const sampleSharedArgs = {
  ...sharedArgs,
  entity_type: 'Sample',
};

const SampleTemplate = (args) => (
  <Summary {...args}>
    <SummaryItem>Fake Organ Type</SummaryItem>
    <Typography variant="h6" component="p">
      Fake Specimen Type
    </Typography>
  </Summary>
);

export const SampleDefault = SampleTemplate.bind({});
SampleDefault.args = {
  ...sampleSharedArgs,
};

export const SampleWithDescription = SampleTemplate.bind({});
SampleWithDescription.args = {
  ...sampleSharedArgs,
  description:
    'Fugiat irure nisi ea dolore non adipisicing non. Enim enim incididunt ut reprehenderit esse sint adipisicing. Aliqua excepteur reprehenderit tempor commodo anim veniam laboris labore exercitation qui. Adipisicing pariatur est anim nisi cupidatat ea Lorem nostrud labore laborum enim eiusmod.',
};

const datasetSharedArgs = {
  ...sharedArgs,
  entity_type: 'Dataset',
};

const DatasetTemplate = (args) => (
  <Summary {...args}>
    <SummaryItem>Fake Data Type</SummaryItem>
    <Typography variant="h6" component="p">
      Fake Organ Type
    </Typography>
  </Summary>
);

export const DatasetDefault = DatasetTemplate.bind({});
DatasetDefault.args = {
  ...datasetSharedArgs,
  status: 'QA',
  mapped_data_access_level: 'Public',
  description:
    'Fugiat irure nisi ea dolore non adipisicing non. Enim enim incididunt ut reprehenderit esse sint adipisicing. Aliqua excepteur reprehenderit tempor commodo anim veniam laboris labore exercitation qui. Adipisicing pariatur est anim nisi cupidatat ea Lorem nostrud labore laborum enim eiusmod.',
  ...DefaultCitation.args,
};
