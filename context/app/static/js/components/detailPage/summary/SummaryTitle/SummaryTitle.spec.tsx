import React from 'react';
import userEvent from '@testing-library/user-event';
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

  it('renders as a link to /organs with breadcrumb label when organIcon is provided', () => {
    render(<SummaryTitle organIcon="Kidney">Kidney</SummaryTitle>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/organs');
    expect(screen.getByText('Organs')).toBeInTheDocument();
  });

  it('shows navigation tooltip on hover for organ pages', async () => {
    render(<SummaryTitle organIcon="Kidney">Kidney</SummaryTitle>);
    await userEvent.hover(screen.getByRole('link'));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Go to Organs');
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

  it('shows navigation tooltip on hover when entity has both link and name', async () => {
    render(<SummaryTitle entityIcon="Dataset">My Dataset</SummaryTitle>);
    await userEvent.hover(screen.getByRole('link'));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Go to Dataset Search');
  });

  it('does not show navigation tooltip when entity has no link', async () => {
    render(<SummaryTitle entityIcon="VerifiedUser">User</SummaryTitle>);
    await userEvent.hover(screen.getByRole('heading'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not show navigation tooltip when no entity icon is provided', async () => {
    render(<SummaryTitle>Plain Title</SummaryTitle>);
    await userEvent.hover(screen.getByRole('heading'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
