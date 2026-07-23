import React from 'react';
import { render, screen } from 'test-utils/functions';
import ParallaxSlide from './ParallaxSlide';
import {
  CLOUD_WORKSPACES_SLIDE,
  CLOUD_WORKSPACES_SLIDE_WITH_ACCESS,
  BIOMARKERS_SLIDE,
  DATASETS_SEARCH_SLIDE,
} from '../config';

// Mock SVG-based icons that fail in test environment due to SVG file mocking.
// SvgIcon is imported inside the factory because vi.mock is hoisted above imports.
vi.mock('js/shared-styles/icons', async () => {
  const { default: SvgIcon } = await import('@mui/material/SvgIcon');
  const actual = await vi.importActual<Record<string, unknown>>('js/shared-styles/icons/icons');
  return Object.fromEntries(Object.keys(actual).map((key) => [key, SvgIcon]));
});

describe('ParallaxSlide', () => {
  test('renders slide title', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    expect(screen.getByText(CLOUD_WORKSPACES_SLIDE.title)).toBeInTheDocument();
  });

  test('renders slide description', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    [CLOUD_WORKSPACES_SLIDE.description].flat().forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
  });

  test('renders multi-paragraph description as separate paragraphs', () => {
    render(<ParallaxSlide config={DATASETS_SEARCH_SLIDE} zIndex={1} />);
    [DATASETS_SEARCH_SLIDE.description].flat().forEach((paragraph) => {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    });
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
    expect(signUpButton).toHaveClass('MuiButton-contained');
    expect(launchButton).toHaveClass('MuiButton-outlined');
  });

  test('outbound CTA button opens in a new tab', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    const signUpButton = screen.getByRole('link', { name: /Sign Up/ });
    expect(signUpButton).toHaveAttribute('target', '_blank');
    expect(signUpButton).toHaveAttribute('rel', 'noopener noreferrer');
    const launchButton = screen.getByRole('link', { name: 'Launch Workspaces' });
    expect(launchButton).not.toHaveAttribute('target');
  });

  test('workspace-access variant hides Sign Up and promotes Launch Workspaces', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE_WITH_ACCESS} zIndex={3} />);
    expect(screen.queryByRole('link', { name: /Sign Up/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Launch Workspaces' })).toHaveClass('MuiButton-contained');
  });

  test('renders slide media as looping muted videos', () => {
    render(<ParallaxSlide config={CLOUD_WORKSPACES_SLIDE} zIndex={3} />);
    CLOUD_WORKSPACES_SLIDE.images.forEach((image) => {
      const video = screen.getByLabelText(image.alt);
      expect(video.tagName).toBe('VIDEO');
      expect(video).toHaveAttribute('src', image.videoSrc);
      expect(video).toHaveAttribute('loop');
      expect(video).toHaveAttribute('playsinline');
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
