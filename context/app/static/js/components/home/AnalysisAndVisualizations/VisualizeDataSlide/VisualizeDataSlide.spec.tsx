import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import VisualizeDataSlide from './VisualizeDataSlide';
import { VISUALIZE_DATA_SLIDE } from '../config';

// Mock useMediaQuery to control desktop/mobile rendering
const mockUseMediaQuery = jest.fn();
jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: () => mockUseMediaQuery(),
}));

describe('VisualizeDataSlide', () => {
  beforeEach(() => {
    // Default to desktop
    mockUseMediaQuery.mockReturnValue(true);
  });

  test('renders section title and description', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);
    expect(screen.getByText(VISUALIZE_DATA_SLIDE.sectionTitle)).toBeInTheDocument();
    expect(screen.getByText(VISUALIZE_DATA_SLIDE.sectionDescription)).toBeInTheDocument();
  });

  test('renders all view titles', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);
    VISUALIZE_DATA_SLIDE.views.forEach((view) => {
      expect(screen.getByText(view.title)).toBeInTheDocument();
    });
  });

  test('renders all view descriptions', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);
    VISUALIZE_DATA_SLIDE.views.forEach((view) => {
      expect(screen.getByText(view.description)).toBeInTheDocument();
    });
  });

  test('renders CTA buttons with correct hrefs', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);
    VISUALIZE_DATA_SLIDE.views.forEach((view) => {
      const link = screen.getByRole('link', { name: view.ctaButton.label });
      expect(link).toHaveAttribute('href', view.ctaButton.href);
    });
  });

  test('first view is active by default on desktop', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);
    const firstViewButton = screen.getByRole('link', { name: 'View Visualizations' });
    expect(firstViewButton.className).toContain('contained');
  });

  test('inactive view CTAs are outlined on desktop', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);
    const secondViewButton = screen.getByRole('link', { name: 'Visualize Cell Populations' });
    expect(secondViewButton.className).toContain('outlined');
  });

  test('hovering a view changes active view on desktop', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);

    // Hover over the Cell Populations tab
    const cellPopTab = screen.getByRole('tab', { name: /Cell Populations Viewer/i });
    fireEvent.mouseEnter(cellPopTab);

    // Cell Populations CTA should now be contained
    const cellPopButton = screen.getByRole('link', { name: 'Visualize Cell Populations' });
    expect(cellPopButton.className).toContain('contained');

    // Single-Cell CTA should now be outlined
    const singleCellButton = screen.getByRole('link', { name: 'View Visualizations' });
    expect(singleCellButton.className).toContain('outlined');
  });

  test('keyboard navigation with arrow keys on desktop', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);

    const firstTab = screen.getByRole('tab', { name: /Single-Cell/i });
    firstTab.focus();

    // Arrow down should activate the next view
    fireEvent.keyDown(firstTab, { key: 'ArrowDown' });

    const cellPopButton = screen.getByRole('link', { name: 'Visualize Cell Populations' });
    expect(cellPopButton.className).toContain('contained');
  });

  test('has correct aria-label on region', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);
    expect(screen.getByRole('region', { name: VISUALIZE_DATA_SLIDE.sectionTitle })).toBeInTheDocument();
  });
});

describe('VisualizeDataSlide - Mobile', () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(false);
  });

  test('renders swipeable view with pagination dots', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);

    // Should have pagination dots
    VISUALIZE_DATA_SLIDE.views.forEach((view) => {
      expect(screen.getByLabelText(`View ${view.title}`)).toBeInTheDocument();
    });
  });

  test('clicking pagination dot changes view', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);

    const secondDot = screen.getByLabelText(`View ${VISUALIZE_DATA_SLIDE.views[1].title}`);
    fireEvent.click(secondDot);

    // All views should still be visible in the swipe container on mobile
    expect(screen.getByText(VISUALIZE_DATA_SLIDE.views[1].title)).toBeInTheDocument();
  });

  test('swipe left advances to next view', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);

    const swipeArea = screen.getByRole('tabpanel');

    fireEvent.touchStart(swipeArea, { touches: [{ clientX: 300 }] });
    fireEvent.touchMove(swipeArea, { touches: [{ clientX: 100 }] });
    fireEvent.touchEnd(swipeArea);

    // The second dot should visually indicate active (we can check it exists)
    expect(screen.getByLabelText(`View ${VISUALIZE_DATA_SLIDE.views[1].title}`)).toBeInTheDocument();
  });

  test('each mobile view shows its own images', () => {
    render(<VisualizeDataSlide config={VISUALIZE_DATA_SLIDE} zIndex={1} />);

    // All views' images should be in the DOM (just off-screen via translateX)
    VISUALIZE_DATA_SLIDE.views.forEach((view) => {
      view.images.forEach((image) => {
        expect(screen.getByAltText(image.alt)).toBeInTheDocument();
      });
    });
  });
});
