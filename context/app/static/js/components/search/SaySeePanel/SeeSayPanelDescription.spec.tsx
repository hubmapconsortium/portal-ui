import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useAppContext } from 'js/components/Contexts';
import { useSavedPreferences } from 'js/components/savedLists/hooks';
import { trackEvent } from 'js/helpers/trackers';

import SaySeePanelDescription from './SeeSayPanelDescription';

jest.mock('js/helpers/trackers');
jest.mock('js/components/Contexts', () => ({
  useAppContext: jest.fn(),
}));
jest.mock('js/components/savedLists/hooks', () => ({
  useSavedPreferences: jest.fn(),
}));

const mockUseAppContext = jest.mocked(useAppContext);
const mockUseSavedPreferences = jest.mocked(useSavedPreferences);
const mockTrackEvent = jest.mocked(trackEvent);
const mockHandleUpdateSavedPreferences = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockUseSavedPreferences.mockReturnValue({
    savedPreferences: {},
    handleUpdateSavedPreferences: mockHandleUpdateSavedPreferences,
    isLoading: false,
    mutate: jest.fn(),
  } as unknown as ReturnType<typeof useSavedPreferences>);
});

function setAppContext(overrides: { isAuthenticated?: boolean; isHubmapUser?: boolean }) {
  mockUseAppContext.mockReturnValue({
    isAuthenticated: false,
    isHubmapUser: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAppContext>);
}

describe('SaySeePanelDescription DataScopeSwitch', () => {
  it('does not render the data-scope switch for an unauthenticated user', () => {
    setAppContext({ isAuthenticated: false });
    render(<SaySeePanelDescription />);
    expect(screen.queryByText('Data scope')).not.toBeInTheDocument();
  });

  it('does not render the data-scope switch for an authed non-HuBMAP user', () => {
    setAppContext({ isAuthenticated: true, isHubmapUser: false });
    render(<SaySeePanelDescription />);
    expect(screen.queryByText('Data scope')).not.toBeInTheDocument();
  });

  it('renders an unchecked switch for a HuBMAP user with no saved preference', () => {
    setAppContext({ isAuthenticated: true, isHubmapUser: true });
    render(<SaySeePanelDescription />);
    expect(screen.getByText('Data scope')).toBeInTheDocument();
    const toggle = screen.getByRole('checkbox', {
      name: /Toggle whether Say & See uses public data/i,
    });
    expect(toggle).not.toBeChecked();
  });

  it('renders a checked switch when saySeeDataScope is "authenticated"', () => {
    setAppContext({ isAuthenticated: true, isHubmapUser: true });
    mockUseSavedPreferences.mockReturnValue({
      savedPreferences: { saySeeDataScope: 'authenticated' },
      handleUpdateSavedPreferences: mockHandleUpdateSavedPreferences,
      isLoading: false,
      mutate: jest.fn(),
    } as unknown as ReturnType<typeof useSavedPreferences>);

    render(<SaySeePanelDescription />);
    expect(screen.getByRole('checkbox', { name: /Toggle whether Say & See uses public data/i })).toBeChecked();
  });

  it('flipping the switch persists the new scope and emits a tracking event', async () => {
    const user = userEvent.setup();
    setAppContext({ isAuthenticated: true, isHubmapUser: true });
    mockUseSavedPreferences.mockReturnValue({
      savedPreferences: { enableOpenKeyNav: true },
      handleUpdateSavedPreferences: mockHandleUpdateSavedPreferences,
      isLoading: false,
      mutate: jest.fn(),
    } as unknown as ReturnType<typeof useSavedPreferences>);

    render(<SaySeePanelDescription />);
    await user.click(screen.getByRole('checkbox', { name: /Toggle whether Say & See uses public data/i }));

    expect(mockHandleUpdateSavedPreferences).toHaveBeenCalledTimes(1);
    expect(mockHandleUpdateSavedPreferences).toHaveBeenCalledWith({
      enableOpenKeyNav: true,
      saySeeDataScope: 'authenticated',
    });
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Say & See',
      action: 'Toggle Data Scope',
      label: 'authenticated',
    });
  });
});
