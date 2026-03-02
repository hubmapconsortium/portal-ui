import React from 'react';
import { render, screen, fireEvent, act } from 'test-utils/functions';
import { trackEvent } from 'js/helpers/trackers';
import useMediaQuery from '@mui/material/useMediaQuery';
import HeroBottomBar from './HeroBottomBar';
import { BOTTOM_BAR_ITEMS } from './const';

jest.mock('@mui/material/useMediaQuery');
const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;
const mockTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>;

let intersectionObserverCallback: IntersectionObserverCallback;

beforeEach(() => {
  global.IntersectionObserver = class MockIntersectionObserver {
    constructor(cb: IntersectionObserverCallback) {
      intersectionObserverCallback = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;

  jest.spyOn(window, 'scrollTo').mockImplementation(jest.fn());
  jest.spyOn(document, 'getElementById').mockReturnValue({
    getBoundingClientRect: () => ({ top: 200 }),
  } as unknown as HTMLElement);
});

describe('HeroBottomBar — desktop', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(true);
  });

  it('renders a nav button for each BOTTOM_BAR_ITEMS entry', () => {
    render(<HeroBottomBar />);
    expect(screen.getAllByRole('button')).toHaveLength(BOTTOM_BAR_ITEMS.length);
  });

  it('renders the correct label for each nav item', () => {
    render(<HeroBottomBar />);
    BOTTOM_BAR_ITEMS.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('fires trackEvent with the correct action on button click', () => {
    render(<HeroBottomBar />);
    fireEvent.click(screen.getByText('Datasets'));
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Homepage',
      action: 'Hero Bottom Bar / Datasets',
    });
  });

  it('calls window.scrollTo on button click', () => {
    render(<HeroBottomBar />);
    fireEvent.click(screen.getByText('Publications'));
    expect(window.scrollTo).toHaveBeenCalledWith({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      top: expect.any(Number),
      behavior: 'smooth',
    });
  });
});

describe('HeroBottomBar — mobile', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
  });

  it('renders a Select dropdown instead of nav buttons', () => {
    render(<HeroBottomBar />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('excludes desktopOnly items from the dropdown options', () => {
    render(<HeroBottomBar />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    expect(screen.queryByRole('option', { name: 'Datasets' })).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Publications' })).toBeInTheDocument();
  });

  it('fires trackEvent with the correct action when an option is selected', () => {
    render(<HeroBottomBar />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'Publications' }));
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Homepage',
      action: 'Hero Bottom Bar / Publications',
    });
  });

  it('calls window.scrollTo when an option is selected', () => {
    render(<HeroBottomBar />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'Publications' }));
    expect(window.scrollTo).toHaveBeenCalledWith({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      top: expect.any(Number),
      behavior: 'smooth',
    });
  });
});

describe('HeroBottomBar — sticky behaviour', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(true);
  });

  it('adds the stuck class when the sentinel leaves the viewport', () => {
    render(<HeroBottomBar />);
    const nav = screen.getByRole('navigation');
    const pillBarOuter = nav.parentElement!;
    expect(pillBarOuter).not.toHaveClass('stuck');

    act(() => {
      intersectionObserverCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(pillBarOuter).toHaveClass('stuck');
  });

  it('removes the stuck class when the sentinel re-enters the viewport', () => {
    render(<HeroBottomBar />);
    const nav = screen.getByRole('navigation');
    const pillBarOuter = nav.parentElement!;

    act(() => {
      intersectionObserverCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(pillBarOuter).toHaveClass('stuck');

    act(() => {
      intersectionObserverCallback([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(pillBarOuter).not.toHaveClass('stuck');
  });
});
