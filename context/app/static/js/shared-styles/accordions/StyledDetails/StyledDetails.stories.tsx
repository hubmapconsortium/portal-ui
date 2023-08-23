import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { Link } from '@mui/material';
import StyledDetails from './StyledDetails';

type DetailsStoryProps = React.ComponentProps<typeof StyledDetails>;

function DetailsStory({ summary, children }: DetailsStoryProps) {
  return (
    <Box height="50vh">
      <StyledDetails summary={summary}>{children}</StyledDetails>
    </Box>
  );
}

export default {
  title: 'Accordions/StyledDetails',
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
      <>
        <Button variant="contained">Clicking me will not expand details</Button>,{' '}
        <Link href="#default" onClick={(e) => e.preventDefault()}>
          and neither will clicking on this link,
        </Link>{' '}
        but clicking elsewhere in the summary works
      </>
    ),
    children: (
      <blockquote>
        <p>Atta-boy! You finished my labyrinth and I&apos;m proud of you!</p>
        <footer>
          - Director Avery Bullock, <cite>Game Night</cite>
        </footer>
      </blockquote>
    ),
  },
};
