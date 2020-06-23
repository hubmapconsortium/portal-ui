/* eslint-disable import/no-unresolved */
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'test-utils/functions';
import VisualizationThemeSwitch from './VisualizationThemeSwitch';

test('switch emits change from light to dark by click on dark label', (done) => {
  function onThemeChange(e) {
    expect(e.target).toBeChecked();
    done();
  }
  const { getByText } = render(<VisualizationThemeSwitch theme="light" onChange={onThemeChange} />);
  const darkLabel = getByText('Dark');
  fireEvent.click(darkLabel);
});

test('switch emits change from dark to light by click on light label', (done) => {
  function onThemeChange(e) {
    expect(e.target).not.toBeChecked();
    done();
  }
  const { getByText } = render(<VisualizationThemeSwitch theme="dark" onChange={onThemeChange} />);
  const lightLabel = getByText('Light');
  fireEvent.click(lightLabel);
});
