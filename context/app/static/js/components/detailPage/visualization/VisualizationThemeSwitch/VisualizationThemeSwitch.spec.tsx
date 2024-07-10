import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render, screen } from 'test-utils/functions';
import VisualizationThemeSwitch from './VisualizationThemeSwitch';

test('switch emits change from light to dark by click on dark label', () => {
  render(<VisualizationThemeSwitch />);
  const lightLabel = screen.getByLabelText('Visualization light theme button');
  const darkLabel = screen.getByLabelText('Visualization dark theme button');
  fireEvent.click(darkLabel);
  expect(darkLabel).toHaveAttribute('aria-pressed', 'true');
  expect(lightLabel).not.toHaveAttribute('aria-pressed', 'true');
});
