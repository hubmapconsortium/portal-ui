import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { render, screen } from 'test-utils/functions';
import AnalysisAndVisualizations from './AnalysisAndVisualizations';
import { CLOUD_WORKSPACES_SLIDE, BIOMARKERS_SLIDE, VISUALIZE_DATA_SLIDE } from './config';

// Mock SVG-based icons that fail in test environment due to SVG file mocking
jest.mock('js/shared-styles/icons', () => {
  const actual = jest.requireActual('js/shared-styles/icons/icons');
  return {
    ...Object.fromEntries(Object.keys(actual).map((key) => [key, SvgIcon])),
  };
});

// Mock useMediaQuery to default to desktop
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: () => true,
}));

describe('AnalysisAndVisualizations', () => {
  test('renders the section header', () => {
    render(<AnalysisAndVisualizations />);
    expect(screen.getByText('Analysis and Visualizations')).toBeInTheDocument();
  });

  test('renders the introductory description', () => {
    render(<AnalysisAndVisualizations />);
    expect(
      screen.getByText(/See how researchers use HuBMAP's data and tools/),
    ).toBeInTheDocument();
  });

  test('renders the Cloud Workspaces slide', () => {
    render(<AnalysisAndVisualizations />);
    expect(screen.getByText(CLOUD_WORKSPACES_SLIDE.title)).toBeInTheDocument();
  });

  test('renders the Biomarkers slide', () => {
    render(<AnalysisAndVisualizations />);
    expect(screen.getByText(BIOMARKERS_SLIDE.title)).toBeInTheDocument();
  });

  test('renders the Visualize Data slide', () => {
    render(<AnalysisAndVisualizations />);
    expect(screen.getByText(VISUALIZE_DATA_SLIDE.sectionTitle)).toBeInTheDocument();
  });

  test('renders all three slides as regions', () => {
    render(<AnalysisAndVisualizations />);
    const regions = screen.getAllByRole('region');
    // Main section + 3 slide regions
    expect(regions.length).toBeGreaterThanOrEqual(3);
  });

  test('Cloud Workspaces slide has Sign Up and Launch Workspaces buttons', () => {
    render(<AnalysisAndVisualizations />);
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/register');
    expect(screen.getByRole('link', { name: 'Launch Workspaces' })).toHaveAttribute('href', '/workspaces');
  });

  test('Biomarkers slide has Launch Advanced Search button', () => {
    render(<AnalysisAndVisualizations />);
    expect(screen.getByRole('link', { name: 'Launch Advanced Search' })).toHaveAttribute('href', '/cells');
  });

  test('Visualize Data slide has all three view CTAs', () => {
    render(<AnalysisAndVisualizations />);
    expect(screen.getByRole('link', { name: 'View Visualizations' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Visualize Cell Populations' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Explore Data' })).toBeInTheDocument();
  });
});
