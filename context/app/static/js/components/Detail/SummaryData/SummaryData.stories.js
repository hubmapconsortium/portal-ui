import React from 'react';
import Typography from '@material-ui/core/Typography';
import SummaryData from './SummaryData';

export default {
  title: 'EntityDetail/Summary/SummaryData',
  component: SummaryData,
};

const sharedArgs = {
  display_doi: 'DOI123',
  entity_type: 'Fake Entity',
  uuid: 'fakeuuid',
  status: 'QA',
  mapped_data_access_level: 'Public',
};

const Template = (args) => <SummaryData {...args} />;
export const Default = Template.bind({});
Default.args = {
  ...sharedArgs,
  entity_type: 'Fake Entity',
};

export const Dataset = Template.bind({});
Dataset.args = {
  ...sharedArgs,
  entity_type: 'Dataset',
};

export const WithChildren = (args) => (
  <SummaryData {...args}>
    <Typography>Child</Typography>
  </SummaryData>
);
WithChildren.args = {
  ...sharedArgs,
  entity_type: 'Dataset',
};
