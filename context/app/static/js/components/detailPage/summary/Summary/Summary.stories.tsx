import React, { ComponentProps, PropsWithChildren, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import Typography from '@mui/material/Typography';

import { Citation } from 'js/components/detailPage/Citation/Citation.stories';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';

import { FlaskDataContext, FlaskDataContextType } from 'js/components/Contexts';
import { Entity } from 'js/components/types';
import Summary from './Summary';

const meta = {
  title: 'EntityDetail/Summary/Summary',
  component: Summary,
} satisfies Meta<typeof Summary>;

export default meta;

const lorem =
  'Fugiat irure nisi ea dolore non adipisicing non. Enim enim incididunt ut reprehenderit esse sint adipisicing. Aliqua excepteur reprehenderit tempor commodo anim veniam laboris labore exercitation qui. Adipisicing pariatur est anim nisi cupidatat ea Lorem nostrud labore laborum enim eiusmod.';

const sharedArgs = {
  uuid: 'fakeuuid',
  title: 'DOI123',
  status: 'QA',
  mapped_data_access_level: 'Public',
  created_timestamp: Date.now(),
} as const;

const donorSharedArgs = {
  ...sharedArgs,
  entity_type: 'Donor',
} as const;

interface WrapperTemplateArgs extends PropsWithChildren, Partial<Entity>, ComponentProps<typeof Summary> {
  status: string;
  mapped_data_access_level: 'Public' | 'Protected' | 'Consortium';
}

function WrapperTemplate({ children, ...args }: WrapperTemplateArgs) {
  const value = useMemo(() => {
    return {
      entity: {
        ...args,
      },
    } as FlaskDataContextType;
  }, [args]);
  return <FlaskDataContext.Provider value={value}>{children}</FlaskDataContext.Provider>;
}

function ChildlessTemplate(args: WrapperTemplateArgs) {
  return (
    <WrapperTemplate {...args}>
      <Summary {...args} />
    </WrapperTemplate>
  );
}
export const DonorDefault: StoryObj<typeof ChildlessTemplate> = {
  args: donorSharedArgs,
};

export const DonorWithDescription: StoryObj<typeof ChildlessTemplate> = {
  args: {
    ...donorSharedArgs,
    description: lorem,
  },
};

const sampleSharedArgs = {
  ...sharedArgs,
  entity_type: 'Sample',
} as const;

function SampleTemplate(args: WrapperTemplateArgs) {
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

export const SampleDefault: StoryObj<typeof SampleTemplate> = {
  args: sampleSharedArgs,
};

export const SampleWithDescription: StoryObj<typeof SampleTemplate> = {
  args: {
    ...sampleSharedArgs,
    description: lorem,
  },
};

function DatasetTemplate(args: WrapperTemplateArgs) {
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

export const DatasetDefault: StoryObj<typeof DatasetTemplate> = {
  args: {
    ...sharedArgs,
    description: lorem,
    entity_type: 'Dataset',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('http://localhost:6006/undefined/datasets/fakeuuid/revisions', () => {
          return HttpResponse.json([{ revision_number: 1, uuid: 'fakeuuid' }]);
        }),
      ],
    },
  },
};

export const CollectionDefault: StoryObj<typeof ChildlessTemplate> = {
  args: {
    ...sharedArgs,
    entity_type: 'Collection',
    description: lorem,
    ...Citation.args.contributors,
    title: 'Fake Collection Name',
    doi: 'DOI123',
    doi_url: 'DOI123',
  },
};
