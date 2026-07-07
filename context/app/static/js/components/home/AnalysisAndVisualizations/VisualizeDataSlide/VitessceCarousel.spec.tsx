import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import VitessceCarousel from './VitessceCarousel';
import { CarouselItem } from '../types';

const items: CarouselItem[] = [
  { src: 'https://example.com/a.png', alt: 'Viz A', href: '/viz-a', assay: 'CODEX', analyte: 'Proteins' },
  { src: 'https://example.com/b.png', alt: 'Viz B', href: '/viz-b', assay: 'Slideseq', analyte: 'RNA' },
];

describe('VitessceCarousel', () => {
  test('renders a thumbnail per item with assay/analyte captions', () => {
    render(<VitessceCarousel items={items} />);
    items.forEach((item) => {
      expect(screen.getByRole('button', { name: `Show ${item.assay} visualization` })).toBeInTheDocument();
      expect(screen.getByText(item.assay)).toBeInTheDocument();
      expect(screen.getByText(item.analyte)).toBeInTheDocument();
    });
  });

  test('main image links to the selected visualization and updates when a thumbnail is clicked', () => {
    render(<VitessceCarousel items={items} />);
    // First item selected by default.
    expect(screen.getByRole('link')).toHaveAttribute('href', items[0].href);
    expect(screen.getByAltText(items[0].alt)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: `Show ${items[1].assay} visualization` }));

    expect(screen.getByRole('link')).toHaveAttribute('href', items[1].href);
    expect(screen.getByAltText(items[1].alt)).toBeInTheDocument();
  });

  test('renders previous/next controls', () => {
    render(<VitessceCarousel items={items} />);
    expect(screen.getByRole('button', { name: 'Previous visualization' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next visualization' })).toBeInTheDocument();
  });
});
