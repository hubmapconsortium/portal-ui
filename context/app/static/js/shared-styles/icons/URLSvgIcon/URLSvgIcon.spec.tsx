import React from 'react';
import { render, screen } from 'test-utils/functions';

import URLSvgIcon from './URLSvgIcon';

test('keeps its mask when the caller passes its own sx', () => {
  render(<URLSvgIcon iconURL="https://example.com/kidney.svg" ariaLabel="Icon for Kidney" sx={{ fontSize: '1rem' }} />);

  const icon = screen.getByRole('img', { name: 'Icon for Kidney' });

  expect(icon).toHaveStyle({ maskImage: 'url(https://example.com/kidney.svg)', fontSize: '1rem' });
});
