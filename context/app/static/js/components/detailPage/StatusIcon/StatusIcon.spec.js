import React from 'react';
import { render, screen } from 'test-utils/functions';
import StatusIcon from './StatusIcon';

const blue = '#2A6FB8';
const red = '#DA348A';
const orange = '#D25435';
const green = '#6C8938';

test.each([
  ['Reopened', blue],
  ['QA', blue],
  ['Locked', blue],
  ['Processing', blue],
  ['Hold', blue],
  ['Invalid', red],
  ['Error', red],
  ['Unpublished', orange],
  ['Deprecated', orange],
  ['Published', green],
])('status %s displays correct color %s', (status, color) => {
  render(<StatusIcon status={status} />);

  expect(screen.getByTestId('status-svg-icon')).toHaveStyle(`color: ${color}`);
});
