import React from 'react';
import { render, screen } from 'test-utils/functions';
import SummaryTitle from './SummaryTitle';

jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn(() => ({
    ref: jest.fn(),
    inView: true,
    entry: undefined,
  })),
}));

describe('SummaryTitle', () => {
  it('renders children as a heading', () => {
    render(<SummaryTitle>Test Title</SummaryTitle>);
    expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument();
  });

  it('renders tooltip icon when iconTooltipText is provided', () => {
    render(<SummaryTitle iconTooltipText="Some tooltip">Title</SummaryTitle>);
    expect(screen.getByTestId('InfoRoundedIcon')).toBeInTheDocument();
  });

  it('renders as a link with breadcrumb for Dataset entity type', () => {
    render(<SummaryTitle entityIcon="Dataset">My Dataset</SummaryTitle>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/search/datasets');
    expect(screen.getByText('Dataset Search')).toBeInTheDocument();
  });

  it('renders as a link for Sample entity type', () => {
    render(<SummaryTitle entityIcon="Sample">My Sample</SummaryTitle>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/search/samples');
    expect(screen.getByText('Sample Search')).toBeInTheDocument();
  });

  it('renders as a link for Donor entity type', () => {
    render(<SummaryTitle entityIcon="Donor">My Donor</SummaryTitle>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/search/donors');
    expect(screen.getByText('Donor Search')).toBeInTheDocument();
  });

  it('renders as a link to /organs when organIcon is provided', () => {
    render(<SummaryTitle organIcon="Kidney">Kidney</SummaryTitle>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/organs');
  });

  it('does not render a link for entity types without a title link', () => {
    render(<SummaryTitle entityIcon="VerifiedUser">User</SummaryTitle>);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('does not render a link when no entityIcon or organIcon is provided', () => {
    render(<SummaryTitle>Plain Title</SummaryTitle>);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders breadcrumb text for Publication entity type', () => {
    render(<SummaryTitle entityIcon="Publication">My Publication</SummaryTitle>);
    expect(screen.getByText('Publications')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/publications');
  });

  it('renders breadcrumb text for Collection entity type', () => {
    render(<SummaryTitle entityIcon="Collection">My Collection</SummaryTitle>);
    expect(screen.getByText('Collections')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/collections');
  });
});
