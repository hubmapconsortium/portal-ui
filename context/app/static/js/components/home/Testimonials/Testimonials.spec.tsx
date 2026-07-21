import React from 'react';
import { render, screen } from 'test-utils/functions';
import Testimonials from './Testimonials';

describe('Testimonials', () => {
  test('renders a linked card for each testimonial target', () => {
    render(<Testimonials />);
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(expect.arrayContaining(['/search/datasets', '/workspaces', '/search/biomarkers-cell-types']));
  });
});
