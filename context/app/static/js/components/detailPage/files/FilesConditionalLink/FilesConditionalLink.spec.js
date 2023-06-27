/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import userEvent from '@testing-library/user-event';

import FilesConditionalLink from './FilesConditionalLink';

const fakeOpenDUA = jest.fn();

test('the element is a link when dua has been agreed to', () => {
  render(
    <FilesConditionalLink hasAgreedToDUA="fake" openDUA={fakeOpenDUA} href="fakeref">
      child
    </FilesConditionalLink>,
  );
  expect(screen.getByRole('link')).toHaveAttribute('href', `fakeref`);
  expect(screen.getByRole('link')).toHaveTextContent('child');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('the element is button when dua has not been agreed to', () => {
  render(
    <FilesConditionalLink hasAgreedToDUA={null} openDUA={fakeOpenDUA} href="fakeref">
      child
    </FilesConditionalLink>,
  );
  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveTextContent('child');
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

test('the button has on click works', () => {
  const mockOpenDUA = jest.fn();
  render(
    <FilesConditionalLink hasAgreedToDUA={null} openDUA={mockOpenDUA} href="fakeref">
      child
    </FilesConditionalLink>,
  );
  expect(mockOpenDUA).toHaveBeenCalledTimes(0);
  userEvent.click(screen.getByRole('button'));
  expect(mockOpenDUA).toHaveBeenCalledTimes(1);
});
