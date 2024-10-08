import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen, fireEvent } from 'test-utils/functions';

import FileBrowserDirectory from './FileBrowserDirectory';

const testDirName = 'fakeDir';
const testChildren = 'directory child';
const testDepth = 2;

function TestFileBrowserDirectory({ dirName = testDirName, depth = testDepth, children = testChildren }) {
  return (
    <FileBrowserDirectory dirName={dirName} depth={depth}>
      {children}
    </FileBrowserDirectory>
  );
}

const directory = {
  get node() {
    return screen.getByText(testDirName);
  },
  get button() {
    return screen.getByRole('button');
  },
  get childrenText() {
    return screen.queryByText(testChildren);
  },
};

test('displays directory name', () => {
  render(<TestFileBrowserDirectory />);

  expect(directory.node).toBeInTheDocument();
});

test('handles click', async () => {
  render(<TestFileBrowserDirectory />);

  expect(directory.childrenText).not.toBeInTheDocument();
  await userEvent.click(directory.button);
  expect(directory.childrenText).toBeInTheDocument();
});

test('handles key down', () => {
  render(<TestFileBrowserDirectory />);

  expect(directory.childrenText).not.toBeInTheDocument();
  fireEvent.keyDown(directory.button, { key: 'Enter', code: 'Enter', keyCode: 13 });
  expect(directory.childrenText).toBeInTheDocument();
});

test('has correct left padding', () => {
  render(<TestFileBrowserDirectory />);

  // depth * indentation multiplier * 8px spacing unit
  const expectedMargin = testDepth * 4 * 8;

  expect(directory.node).toHaveStyle(`margin-left: ${expectedMargin}px`);
});

test('is keyboard focusable', async () => {
  render(<TestFileBrowserDirectory />);

  expect(document.body).toHaveFocus();
  await userEvent.tab();
  expect(directory.button).toHaveFocus();
});
