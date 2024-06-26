import React, { useMemo } from 'react';
import { http } from 'msw';
import Typography from '@mui/material/Typography';

import { Citation } from 'js/components/detailPage/Citation/Citation.stories';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';

import { FlaskDataContext } from 'js/components/Contexts';
import Summary from './Summary';

export default {
  title: 'EntityDetail/Summary/Summary',
  component: Summary,
};

const lorem =
  'Fugiat irure nisi ea dolore non adipisicing non. Enim enim incididunt ut reprehenderit esse sint adipisicing. Aliqua excepteur reprehenderit tempor commodo anim veniam laboris labore exercitation qui. Adipisicing pariatur est anim nisi cupidatat ea Lorem nostrud labore laborum enim eiusmod.';

const sharedArgs = {
  uuid: 'fakeuuid',
  created_timestamp: Date.now(),
  last_modified_timestamp: Date.now(),
  title: 'DOI123',
};

const donorSharedArgs = {
  ...sharedArgs,
  entity_type: 'Donor',
};

function WrapperTemplate({ children, ...args }) {
  const value = useMemo(() => {
    return {
      entity: {
        ...args,
      },
    };
  }, [args]);
  return <FlaskDataContext.Provider value={value}>{children}</FlaskDataContext.Provider>;
}

function ChildlessTemplate(args) {
  return (
    <WrapperTemplate {...args}>
      <Summary {...args} />
    </WrapperTemplate>
  );
}
export const DonorDefault = ChildlessTemplate.bind({});
DonorDefault.args = {
  ...donorSharedArgs,
};

export const DonorWithDescription = ChildlessTemplate.bind({});
DonorWithDescription.args = {
  ...donorSharedArgs,
  description: lorem,
};

const sampleSharedArgs = {
  ...sharedArgs,
  entity_type: 'Sample',
};

function SampleTemplate(args) {
  return (
    <WrapperTemplate {...args}>
      <Summary {...args}>
        <SummaryItem>Fake Organ Type</SummaryItem>
        <Typography variant="h6" component="p">
          Fake Sample Category
        </Typography>
      </Summary>
    </WrapperTemplate>
  );
}

export const SampleDefault = SampleTemplate.bind({});
SampleDefault.args = {
  ...sampleSharedArgs,
};

export const SampleWithDescription = SampleTemplate.bind({});
SampleWithDescription.args = {
  ...sampleSharedArgs,
  description: lorem,
};

function DatasetTemplate(args) {
  return (
    <WrapperTemplate {...args}>
      <Summary {...args}>
        <SummaryItem>Fake Data Type</SummaryItem>
        <Typography variant="h6" component="p">
          Fake Organ Type
        </Typography>
      </Summary>
    </WrapperTemplate>
  );
}

export const DatasetDefault = DatasetTemplate.bind({});
DatasetDefault.args = {
  ...sharedArgs,
  entity_type: 'Dataset',
  status: 'QA',
  mapped_data_access_level: 'Public',
  description: lorem,
  ...Citation.args,
};

DatasetDefault.parameters = {
  msw: {
    handlers: [
      http.get('http://localhost:6006/undefined/datasets/fakeuuid/revisions', (req, res, ctx) => {
        return res(ctx.json([{ revision_number: 1, uuid: 'fakeuuid' }]));
      }),
    ],
  },
};

export const CollectionDefault = ChildlessTemplate.bind({});
CollectionDefault.args = {
  ...sharedArgs,
  entity_type: 'Collection',
  description: lorem,
  ...Citation.args,
  collectionName: 'Fake Collection Name',
};
