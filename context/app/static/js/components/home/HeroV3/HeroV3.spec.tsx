import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import { trackEvent } from 'js/helpers/trackers';
import useMediaQuery from '@mui/material/useMediaQuery';
import HeroV3 from './HeroV3';

jest.mock('js/shared-styles/icons', () => {
  const MockIcon = () => null;
  return {
    OrganIcon: MockIcon,
    CellTypeIcon: MockIcon,
    GeneIcon: MockIcon,
    DatasetIcon: MockIcon,
    PublicationIcon: MockIcon,
    VisualizationIcon: MockIcon,
  };
});

jest.mock('@mui/material/useMediaQuery');
const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;
const mockTrackEvent = trackEvent as jest.MockedFunction<typeof trackEvent>;

beforeEach(() => {
  // Render the desktop pill bar to avoid rendering the Select dropdown
  mockUseMediaQuery.mockReturnValue(true);
  // HeroBackground uses matchMedia for prefers-reduced-motion
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  jest.spyOn(window, 'scrollTo').mockImplementation(jest.fn());
  jest.spyOn(document, 'getElementById').mockReturnValue({
    getBoundingClientRect: () => ({ top: 200 }),
  } as unknown as HTMLElement);
});

describe('HeroV3', () => {
  it('renders the section with the correct aria-label', () => {
    render(<HeroV3 />);
    expect(screen.getByRole('region', { name: 'HuBMAP Data Portal Introduction' })).toBeInTheDocument();
  });

  it('renders the page title', () => {
    render(<HeroV3 />);
    expect(screen.getByTestId('home-page-title')).toHaveTextContent(
      'Explore Healthy Human Single-Cell and Spatial Data',
    );
  });

  it('renders all three hero card links', () => {
    render(<HeroV3 />);
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining(['/organs', '/cell-types', '/biomarkers']));
  });

  it('renders the Explore All Datasets link pointing to /search/datasets', () => {
    render(<HeroV3 />);
    expect(screen.getByRole('link', { name: 'Explore All Datasets' })).toHaveAttribute('href', '/search/datasets');
  });

  it('renders the Launch Workspaces link pointing to /workspaces', () => {
    render(<HeroV3 />);
    expect(screen.getByRole('link', { name: 'Launch Workspaces' })).toHaveAttribute('href', '/workspaces');
  });

  it('fires trackEvent when Explore All Datasets is clicked', () => {
    render(<HeroV3 />);
    fireEvent.click(screen.getByRole('link', { name: 'Explore All Datasets' }));
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Homepage',
      action: 'Hero / Explore All Datasets Button',
    });
  });

  it('fires trackEvent when Launch Workspaces is clicked', () => {
    render(<HeroV3 />);
    fireEvent.click(screen.getByRole('link', { name: 'Launch Workspaces' }));
    expect(mockTrackEvent).toHaveBeenCalledWith({
      category: 'Homepage',
      action: 'Hero / Launch Workspaces Button',
    });
  });
});
