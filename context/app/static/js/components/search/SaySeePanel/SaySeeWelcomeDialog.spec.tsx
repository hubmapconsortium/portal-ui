import React from 'react';
import { render, screen, waitFor } from 'test-utils/functions';
import userEvent from '@testing-library/user-event';

import SaySeeWelcomeDialog from './SaySeeWelcomeDialog';

const LOCAL_STORAGE_KEY = 'hubmap-say-see-welcome-seen';

beforeEach(() => {
  window.localStorage.clear();
});

describe('SaySeeWelcomeDialog', () => {
  it('opens on first mount when localStorage is empty', () => {
    render(<SaySeeWelcomeDialog />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to Say & See Mode/i)).toBeInTheDocument();
  });

  it('does not open when the seen flag is already set', () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    render(<SaySeeWelcomeDialog />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('clicking Explore closes the dialog and persists the seen flag', async () => {
    const user = userEvent.setup();
    render(<SaySeeWelcomeDialog />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Explore$/ }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('true');
  });
});
