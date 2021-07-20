import React from 'react';

import EntityTileFooter from './EntityTileFooter';

export default {
  title: 'EntityTile/EntityTileFooter',
  component: EntityTileFooter,
};

const sharedArgs = {
  entityData: { last_modified_timestamp: Date.now() },
  invertColors: false,
};

const Template = (args) => <EntityTileFooter {...args} />;
export const DonorOrSample = Template.bind({});
DonorOrSample.args = {
  ...sharedArgs,
  descendantCounts: { Sample: 1, Dataset: 2 },
};

export const Dataset = Template.bind({});
Dataset.args = {
  ...sharedArgs,
  descendantCounts: { Dataset: 1 },
};

export const DatasetWithSupport = Template.bind({});
DatasetWithSupport.args = {
  ...sharedArgs,
  descendantCounts: { Dataset: 1, Support: 2 },
};

export const InvertedColors = Template.bind({});
InvertedColors.args = {
  ...sharedArgs,
  invertColors: true,
  descendantCounts: { Dataset: 1 },
};
