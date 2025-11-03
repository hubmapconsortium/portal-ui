import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import TutorialsFilterBar from './TutorialsFilterBar';
import { TutorialLandingPageContextProvider } from './TutorialLandingPageContext';
import { TUTORIAL_CATEGORIES } from './types';

// Mock SelectableChip component
jest.mock('js/shared-styles/chips/SelectableChip', () => ({
  __esModule: true,
  default: ({
    label,
    isSelected,
    onClick,
    ...props
  }: {
    label: string;
    isSelected: boolean;
    onClick: () => void;
    [key: string]: unknown;
  }) => (
    <button data-testid={`filter-chip-${label}`} onClick={onClick} aria-pressed={isSelected} {...props}>
      {label} {isSelected ? '(selected)' : ''}
    </button>
  ),
}));

jest.mock('./types', () => ({
  ...jest.requireActual('./types'),
  TUTORIALS: [
    {
      title: 'Data Tutorial',
      route: 'data-tutorial',
      description: 'Learn about data',
      category: 'Data',
      tags: ['Data'],
      iframeLink: 'https://example.com/tutorial1',
    },
    {
      title: 'Visualization Tutorial',
      route: 'viz-tutorial',
      description: 'Learn about visualization',
      category: 'Visualization',
      tags: ['Visualization'],
      iframeLink: 'https://example.com/tutorial2',
    },
  ],
}));

describe('TutorialsFilterBar', () => {
  const renderWithProvider = () => {
    return render(
      <TutorialLandingPageContextProvider>
        <TutorialsFilterBar />
      </TutorialLandingPageContextProvider>,
    );
  };

  it('should render filter bar with title and icon', () => {
    renderWithProvider();

    expect(screen.getByText('Filter by Category')).toBeInTheDocument();
    // The label is for the filter group, not an actual form input
    expect(screen.getByText('Filter by Category')).toHaveAttribute('for', 'tutorial-category-filters');
  });

  it('should render all tutorial categories as filter chips', () => {
    renderWithProvider();

    TUTORIAL_CATEGORIES.forEach((category) => {
      expect(screen.getByTestId(`filter-chip-${category}`)).toBeInTheDocument();
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('should show no categories as selected initially', () => {
    renderWithProvider();

    TUTORIAL_CATEGORIES.forEach((category) => {
      const chip = screen.getByTestId(`filter-chip-${category}`);
      expect(chip).toHaveAttribute('aria-pressed', 'false');
      expect(chip).not.toHaveTextContent('(selected)');
    });
  });

  it('should select category when chip is clicked', () => {
    renderWithProvider();

    const dataChip = screen.getByTestId('filter-chip-Data');

    fireEvent.click(dataChip);

    expect(dataChip).toHaveAttribute('aria-pressed', 'true');
    expect(dataChip).toHaveTextContent('(selected)');
  });

  it('should deselect category when selected chip is clicked again', () => {
    renderWithProvider();

    const dataChip = screen.getByTestId('filter-chip-Data');

    // First click to select
    fireEvent.click(dataChip);
    expect(dataChip).toHaveAttribute('aria-pressed', 'true');

    // Second click to deselect
    fireEvent.click(dataChip);
    expect(dataChip).toHaveAttribute('aria-pressed', 'false');
    expect(dataChip).not.toHaveTextContent('(selected)');
  });

  it('should only allow one category to be selected at a time', () => {
    renderWithProvider();

    const dataChip = screen.getByTestId('filter-chip-Data');
    const vizChip = screen.getByTestId('filter-chip-Visualization');

    // Select Data category
    fireEvent.click(dataChip);
    expect(dataChip).toHaveAttribute('aria-pressed', 'true');

    // Select Visualization category
    fireEvent.click(vizChip);
    expect(vizChip).toHaveAttribute('aria-pressed', 'true');
    expect(dataChip).toHaveAttribute('aria-pressed', 'false');
  });

  it('should have proper accessibility structure', () => {
    renderWithProvider();

    // Check that the label correctly references the filter group
    const label = screen.getByText('Filter by Category');
    expect(label).toHaveAttribute('for', 'tutorial-category-filters');

    // Check for buttons with proper aria-pressed attributes
    const dataChip = screen.getByTestId('filter-chip-Data');
    expect(dataChip).toHaveAttribute('aria-pressed', 'false');
  });

  it('should render all expected tutorial categories', () => {
    renderWithProvider();

    // Verify all categories from the types are rendered
    const expectedCategories = ['Biomarker and Cell Type Search', 'Data', 'Visualization', 'Workspaces'];

    expectedCategories.forEach((category) => {
      expect(screen.getByTestId(`filter-chip-${category}`)).toBeInTheDocument();
    });
  });
});
