import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useSnackbarStore } from './store';
import { SnackbarMessage } from './types';
import StyledSnackbar from './StyledSnackbar';

function SnackbarStory({ message, severity }: SnackbarMessage) {
  const { openSnackbar } = useSnackbarStore();
  return (
    <Button variant="contained" color="primary" onClick={() => openSnackbar(message, severity)}>
      Open snackbar
    </Button>
  );
}

function SnackbarStoryWrapper(message: SnackbarMessage) {
  return (
    <Box height="50vh">
      <SnackbarStory {...message} />
      <StyledSnackbar />
    </Box>
  );
}

export default {
  title: 'Snackbars/StyledSnackbar',
  component: SnackbarStoryWrapper,
  argTypes: {
    message: { control: 'text' },
    severity: {
      options: ['warning', 'error', 'success', 'info'],
      control: { type: 'select' },
      default: 'info',
    },
  },
} satisfies Meta<typeof SnackbarStory>;

type Story = StoryObj<typeof SnackbarStory>;

export const Default: Story = {
  args: {
    message: 'This is a snackbar message',
    severity: 'info',
  },
};
