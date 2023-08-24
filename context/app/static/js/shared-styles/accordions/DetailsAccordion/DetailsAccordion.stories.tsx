import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import DetailsAccordion from './DetailsAccordion';

type DetailsStoryProps = React.ComponentProps<typeof DetailsAccordion>;

function DetailsStory({ summary, children }: DetailsStoryProps) {
  return (
    <Box height="10em">
      <DetailsAccordion summary={summary}>{children}</DetailsAccordion>
    </Box>
  );
}

export default {
  title: 'Accordions/DetailsAccordion',
  component: DetailsStory,
  argTypes: {
    summary: { control: 'text' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof DetailsStory>;

type Story = StoryObj<typeof DetailsStory>;

export const Default: Story = {
  args: {
    summary: 'Additional Details',
    children: 'This is the content of the details',
  },
};

export const WithReactChild: Story = {
  args: {
    summary: 'Additional Details',
    children: (
      <>
        I am a more complicated child, with a button:
        <Button variant="contained">Click Me</Button>
      </>
    ),
  },
};

export const WithReactSummary: Story = {
  args: {
    summary: (
      <Typography variant="subtitle2" color="purple">
        Who would build a labyrinth down here?
      </Typography>
    ),
    children: (
      <blockquote>
        <p>Atta-boy! You finished my labyrinth and I&apos;m proud of you!</p>
        <footer>
          - Deputy Director Avery Bullock, <cite>Game Night</cite>
        </footer>
      </blockquote>
    ),
  },
};
