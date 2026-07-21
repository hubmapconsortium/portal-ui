import React from 'react';
import { render, screen } from 'test-utils/functions';
import ParallaxImage from './ParallaxImage';

describe('ParallaxImage', () => {
  test('renders image with correct alt text', () => {
    render(<ParallaxImage src="https://example.com/test.jpg" alt="Test image" isReducedMotion={false} />);
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });

  test('renders image with correct src', () => {
    render(<ParallaxImage src="https://example.com/test.jpg" alt="Test image" isReducedMotion={false} />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('src', 'https://example.com/test.jpg');
  });

  test('applies lazy loading', () => {
    render(<ParallaxImage src="https://example.com/test.jpg" alt="Test image" isReducedMotion={false} />);
    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});
