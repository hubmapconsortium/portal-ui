import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { render, screen } from 'test-utils/functions';
import ParallaxSlide from './ParallaxSlide';
import { CLOUD_WORKSPACES_SLIDE, BIOMARKERS_SLIDE } from '../config';

// Mock SVG-based icons that fail in test environment due to SVG file mocking
jest.mock('js/shared-styles/icons', () => {
  const actual = jest.requireActual('js/shared-styles/icons/icons');
  return {
    ...Object.fromEntries(Object.keys(actual).map((key) => [key, SvgIcon])),
  };
});

describe('ParallaxSlide', () => {
  test('renders slide title', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    expect(screen.getByText(CLOUD_WORKSPACES_SLIDE.title)).toBeInTheDocument();
  });

  test('renders slide description', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    expect(screen.getByText(CLOUD_WORKSPACES_SLIDE.description)).toBeInTheDocument();
  });

  test('renders bullet points', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    CLOUD_WORKSPACES_SLIDE.bulletPoints!.forEach((point) => {
      expect(screen.getByText(point)).toBeInTheDocument();
    });
  });

  test('renders all CTA buttons with correct hrefs', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    CLOUD_WORKSPACES_SLIDE.ctaButtons.forEach((button) => {
      const link = screen.getByRole('link', { name: button.label });
      expect(link).toHaveAttribute('href', button.href);
    });
  });

  test('renders contained and outlined button variants', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    const signUpButton = screen.getByRole('link', { name: 'Sign Up' });
    const launchButton = screen.getByRole('link', { name: 'Launch Workspaces' });
    expect(signUpButton.className).toContain('contained');
    expect(launchButton.className).toContain('outlined');
  });

  test('renders images with correct alt text', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    CLOUD_WORKSPACES_SLIDE.images.forEach((image) => {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    });
  });

  test('has correct aria-label for the region', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    expect(screen.getByRole('region', { name: CLOUD_WORKSPACES_SLIDE.title })).toBeInTheDocument();
  });

  test('renders biomarkers slide with different layout', () => {
    render(<ParallaxSlide config={BIOMARKERS_SLIDE} zIndex={2} />);
    expect(screen.getByText(BIOMARKERS_SLIDE.title)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Launch Advanced Search' })).toHaveAttribute('href', '/cells');
  });
});
