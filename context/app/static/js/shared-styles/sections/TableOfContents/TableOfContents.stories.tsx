import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { DownloadIcon } from 'js/shared-styles/icons';
import TableOfContents, { TableOfContentsItems } from './TableOfContents';

interface HeaderStoryComponent {
  items: TableOfContentsItems;
}

const storyItems = [
  { text: 'Charmander', hash: 'charmander', icon: DownloadIcon },
  {
    text: 'Squirtle',
    hash: 'squirtle',
    showItemsBackground: true,
    items: [
      {
        text: 'Wartortle',
        hash: 'wartortle',
        icon: DownloadIcon,
        items: [{ text: 'Blastoise', hash: 'blastoise', icon: DownloadIcon }],
      },
      {
        text: 'Wartortle2',
        hash: 'wartortle2',
        icon: DownloadIcon,
        items: [{ text: 'Blastoise2', hash: 'blastoise2', icon: DownloadIcon }],
      },
    ],
    icon: DownloadIcon,
  },
  { text: 'Bulbasaur', hash: 'Bulbasaur', icon: DownloadIcon },
];

function ToCStoryComponent({ items }: HeaderStoryComponent) {
  return (
    <Stack direction="row">
      <TableOfContents items={items} />
      <Stack>
        {items
          .map((item) => [item, ...(item.items ?? [])])
          .flat()
          .map((item) => (
            <Box key={item.text} id={item.hash} sx={{ height: '300px' }}>
              {item.text}
            </Box>
          ))}
      </Stack>
    </Stack>
  );
}

const meta: Meta = {
  title: 'TableOfContents/TableOfContents',
  component: ToCStoryComponent,
};

type Story = StoryObj<typeof TableOfContents>;

export const Default: Story = {
  args: {
    items: storyItems,
  },
};

export default meta;
