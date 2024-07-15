import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import { getArrayRange } from 'js/helpers/functions';
import { ESEntityType } from 'js/components/types';
import SummaryData from './SummaryData';

interface TemplateArgs {
  entity_type: ESEntityType;
  title: string;
  uuid: string;
  status: string;
  mapped_data_access_level: string;
}

const sharedArgs: TemplateArgs = {
  title: 'DOI123',
  entity_type: 'Sample',
  uuid: 'fakeuuid',
  status: 'QA',
  mapped_data_access_level: 'Public',
};

const Template = SummaryData;

const meta = {
  title: 'EntityDetail/Summary/SummaryData',
  component: SummaryData,
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:6006/undefined/datasets/fakeuuid/revisions', () => {
          return HttpResponse.json({ revision_number: 1, uuid: 'fakeuuid' });
        }),
      ],
    },
  },
} satisfies Meta<typeof Template>;

export default meta;

export const Default: StoryObj<typeof Template> = {
  args: sharedArgs,
};

export const Dataset: StoryObj<typeof Template> = {
  args: {
    ...sharedArgs,
    entity_type: 'Dataset',
  },
};

export const WithChildren: StoryObj<typeof Template> = {
  args: {
    ...sharedArgs,
    entity_type: 'Dataset',
    children: getArrayRange(8).map((n) => <SummaryItem key={n}>Child {n}</SummaryItem>),
  },
};
