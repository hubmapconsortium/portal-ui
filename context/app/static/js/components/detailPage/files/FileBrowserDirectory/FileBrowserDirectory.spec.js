import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen, fireEvent } from 'test-utils/functions';

import FileBrowserDirectory from './FileBrowserDirectory';

test('displays directory name', () => {
  render(
    <FileBrowserDirectory dirName="fakedir" depth={2}>
      directory child
    </FileBrowserDirectory>,
  );

  expect(screen.getByText('fakedir')).toBeInTheDocument();
});

test('handles click', () => {
  render(
    <FileBrowserDirectory dirName="fakedir" depth={2}>
      directory child
    </FileBrowserDirectory>,
  );

  expect(screen.queryByText('directory child')).not.toBeInTheDocument();
  userEvent.click(screen.getByRole('button'));
  expect(screen.getByText('directory child')).toBeInTheDocument();
});

test('handles key down', () => {
  render(
    <FileBrowserDirectory dirName="fakedir" depth={2}>
      directory child
    </FileBrowserDirectory>,
  );

  expect(screen.queryByText('directory child')).not.toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter', code: 'Enter', keyCode: 13 });
  expect(screen.getByText('directory child')).toBeInTheDocument();
});

test('has correct left padding', () => {
  const depth = 2;
  render(
    <FileBrowserDirectory dirName="fakedir" depth={depth}>
      directory child
    </FileBrowserDirectory>,
  );

  // depth * indentation multiplier * 8px spacing unit
  const expectedPadding = depth * 1.5 * 8;
  const offset = 40;

  expect(screen.getByText('fakedir')).toHaveStyle(`padding-left: calc(${expectedPadding}px + ${offset}px)`);
});

test('is keyboard focusable', () => {
  render(
    <FileBrowserDirectory dirName="fakedir" depth={2}>
      directory child
    </FileBrowserDirectory>,
  );

  expect(document.body).toHaveFocus();
  userEvent.tab();
  expect(screen.getByRole('button')).toHaveFocus();
});
