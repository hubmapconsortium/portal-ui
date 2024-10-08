import React, { ComponentProps, PropsWithChildren, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { FlaskDataContext, FlaskDataContextType } from 'js/components/Contexts';
import { Citation } from 'js/components/detailPage/Citation/Citation.stories';
import { Entity } from 'js/components/types';

import SummaryBody from './SummaryBody';

interface WrapperTemplateArgs extends PropsWithChildren, Partial<Entity>, ComponentProps<typeof SummaryBody> {
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

const meta = {
  title: 'EntityDetail/Summary/SummaryBody',
  component: SummaryBody,
} satisfies Meta<typeof SummaryBody>;

export default meta;

const sharedArgs = {
  created_timestamp: Date.now(),
  last_modified_timestamp: Date.now(),
};

const description =
  'Fugiat irure nisi ea dolore non adipisicing non. Enim enim incididunt ut reprehenderit esse sint adipisicing. Aliqua excepteur reprehenderit tempor commodo anim veniam laboris labore exercitation qui. Adipisicing pariatur est anim nisi cupidatat ea Lorem nostrud labore laborum enim eiusmod.';

export const Default: StoryObj<typeof WrapperTemplate> = {
  args: sharedArgs,
};

export const WithDescription: StoryObj<typeof WrapperTemplate> = {
  args: {
    ...sharedArgs,
    description,
  },
};

const { contributors, doi, doi_url } = Citation.args;

export const WithCitation: StoryObj<typeof WrapperTemplate> = {
  args: {
    ...sharedArgs,
    description,
    contributors,
    doi,
    doi_url,
  },
};

export const WithCollectionName: StoryObj<typeof WrapperTemplate> = {
  args: {
    ...sharedArgs,
    description,
    collectionName: 'Fake Collection Name',
  },
};
