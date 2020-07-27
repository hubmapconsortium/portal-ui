/* eslint-disable import/no-unresolved */
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'test-utils/functions';
import VisualizationThemeSwitch from './VisualizationThemeSwitch';

test('switch emits change from light to dark by click on dark label', (done) => {
  function onThemeChange(e) {
    expect(e.target).not.toHaveAttribute('aria-pressed', expect.stringContaining('true'));
    done();
  }
  const { getByLabelText } = render(<VisualizationThemeSwitch theme="light" onChange={onThemeChange} />);
  const darkLabel = getByLabelText('Visualization dark theme button');
  fireEvent.click(darkLabel);
});

test('switch emits change from dark to light by click on light label', (done) => {
  function onThemeChange(e) {
    expect(e.target).not.toHaveAttribute('aria-pressed', expect.stringContaining('true'));
    done();
  }
  const { getByLabelText } = render(<VisualizationThemeSwitch theme="dark" onChange={onThemeChange} />);
  const lightLabel = getByLabelText('Visualization light theme button');
  fireEvent.click(lightLabel);
});
