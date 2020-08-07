/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import FilesConditionalLink from './FilesConditionalLink';

const fakeOpenDUA = () => {};

test('the link is functional when dua has been agreed to', () => {
  // const { hasAgreedToDUA, openDUA, href, children, ...rest } = props;
  render(
    <FilesConditionalLink hasAgreedToDUA="fake" openDUA={fakeOpenDUA} href="fakeref">
      child
    </FilesConditionalLink>,
  );
  expect(screen.getByRole('link')).toHaveAttribute('href', `fakeref`);
  expect(screen.getByRole('link')).toHaveTextContent('child');
  expect(screen.queryByRole('button')).toBeNull();
});

test('the link is functional when dua has been agreed to', () => {
  // const { hasAgreedToDUA, openDUA, href, children, ...rest } = props;
  render(
    <FilesConditionalLink hasAgreedToDUA={null} openDUA={fakeOpenDUA} href="fakeref">
      child
    </FilesConditionalLink>,
  );
  expect(screen.getByRole('button')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveTextContent('child');
  expect(screen.queryByRole('link')).toBeNull();
});
