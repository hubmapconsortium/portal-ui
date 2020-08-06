/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import StatusIcon from './StatusIcon';

test.each([
  ['Reopened', '#3781D1'],
  ['QA', '#3781D1'],
  ['Locked', '#3781D1'],
  ['Processing', '#3781D1'],
  ['Hold', '#3781D1'],
  ['Invalid', '#DA348A'],
  ['Error', '#DA348A'],
  ['Unpublished', '#D25435'],
  ['Deprecated', '#D25435'],
  ['Published', '#6C8938'],
])('status %s displays correct color %s', (status, color) => {
  render(<StatusIcon status={status} />);

  expect(screen.getByTestId('status-svg-icon')).toHaveStyle(`color: ${color}`);
});
