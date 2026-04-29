import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';

import SaySeeAlert from './SaySeeAlert';

const LOCAL_STORAGE_KEY = 'hubmap-say-see-alert-dismissed';

function renderWithUrl(onUrlUpdate?: OnUrlUpdateFunction) {
  return render(
    <NuqsTestingAdapter searchParams="" onUrlUpdate={onUrlUpdate} hasMemory>
      <SaySeeAlert />
    </NuqsTestingAdapter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('SaySeeAlert', () => {
  it('renders when localStorage is empty', () => {
    renderWithUrl();
    expect(screen.getByText(/Try a preview of the Say & See Mode/i)).toBeInTheDocument();
  });

  it('does not render when the dismissed flag is set in localStorage', () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    renderWithUrl();
    expect(screen.queryByText(/Try a preview of the Say & See Mode/i)).not.toBeInTheDocument();
  });

  it('clicking the CTA flips mode to say-see, dismisses the alert, and persists dismissal', async () => {
    const user = userEvent.setup();
    const onUrlUpdate: jest.MockedFunction<OnUrlUpdateFunction> = jest.fn();
    renderWithUrl(onUrlUpdate);

    await user.click(screen.getByRole('button', { name: /Explore with Say & See Mode/i }));

    expect(screen.queryByText(/Try a preview of the Say & See Mode/i)).not.toBeInTheDocument();
    expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('true');
    expect(onUrlUpdate).toHaveBeenCalled();
    const lastCall = onUrlUpdate.mock.calls.at(-1)![0];
    expect(lastCall.searchParams.get('mode')).toBe('say-see');
  });

  it('clicking the close X dismisses the alert without changing mode', async () => {
    const user = userEvent.setup();
    const onUrlUpdate: jest.MockedFunction<OnUrlUpdateFunction> = jest.fn();
    renderWithUrl(onUrlUpdate);

    await user.click(screen.getByRole('button', { name: /Dismiss Say and See promo/i }));

    expect(screen.queryByText(/Try a preview of the Say & See Mode/i)).not.toBeInTheDocument();
    expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('true');
    expect(onUrlUpdate).not.toHaveBeenCalled();
  });
});
