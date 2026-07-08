import React from 'react';
import { render, screen, fireEvent } from 'test-utils/functions';
import VitessceCarousel from './VitessceCarousel';
import { CarouselItem } from '../types';

const items: CarouselItem[] = [
  { src: 'https://example.com/a.png', alt: 'Viz A', href: '/viz-a', assay: 'CODEX', analyte: 'Proteins' },
  { src: 'https://example.com/b.png', alt: 'Viz B', href: '/viz-b', assay: 'Slideseq', analyte: 'RNA' },
];

const thumbName = (item: CarouselItem, index: number) =>
  `${item.assay}, ${item.analyte}, ${index + 1} of ${items.length}`;

describe('VitessceCarousel', () => {
  test('renders a labeled carousel with a thumbnail per item', () => {
    render(<VitessceCarousel items={items} />);
    expect(screen.getByRole('group', { name: 'Example Vitessce visualizations' })).toBeInTheDocument();
    items.forEach((item, index) => {
      expect(screen.getByRole('button', { name: thumbName(item, index) })).toBeInTheDocument();
      expect(screen.getByText(item.assay)).toBeInTheDocument();
      expect(screen.getByText(item.analyte)).toBeInTheDocument();
    });
  });

  test('main image links to the selected visualization and updates when a thumbnail is clicked', () => {
    render(<VitessceCarousel items={items} />);
    // First item selected by default.
    expect(screen.getByRole('link')).toHaveAttribute('href', items[0].href);
    expect(screen.getByAltText(items[0].alt)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: thumbName(items[1], 1) }));

    expect(screen.getByRole('link')).toHaveAttribute('href', items[1].href);
    expect(screen.getByAltText(items[1].alt)).toBeInTheDocument();
  });

  test('renders previous/next controls', () => {
    render(<VitessceCarousel items={items} />);
    expect(screen.getByRole('button', { name: 'Previous visualization' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next visualization' })).toBeInTheDocument();
  });

  test('announces the current slide via a live region, including from the arrows', () => {
    render(<VitessceCarousel items={items} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Showing 1 of 2: CODEX, Proteins');

    fireEvent.click(screen.getByRole('button', { name: 'Next visualization' }));
    expect(status).toHaveTextContent('Showing 2 of 2: Slideseq, RNA');
  });

  test('thumbnails use a roving tabindex navigable with arrow keys', () => {
    render(<VitessceCarousel items={items} />);
    const firstThumb = screen.getByRole('button', { name: thumbName(items[0], 0) });
    const secondThumb = screen.getByRole('button', { name: thumbName(items[1], 1) });

    // Only the selected thumbnail is in the tab order.
    expect(firstThumb).toHaveAttribute('tabindex', '0');
    expect(secondThumb).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(firstThumb, { key: 'ArrowRight' });

    // Selection (and the tab order) follows the arrow key, moving focus to the next thumbnail.
    expect(secondThumb).toHaveAttribute('tabindex', '0');
    expect(firstThumb).toHaveAttribute('tabindex', '-1');
    expect(secondThumb).toHaveFocus();
    expect(screen.getByRole('link')).toHaveAttribute('href', items[1].href);
  });
});
