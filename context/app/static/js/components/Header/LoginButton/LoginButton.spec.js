/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import userEvent from '@testing-library/user-event';

import LoginButton from './LoginButton';

test('should be login button when not authenticated', () => {
  render(<LoginButton isAuthenticated={false} />);
  expect(screen.getByText('Member Login')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/login');
});

test('should be logout button when authenticated', () => {
  render(<LoginButton isAuthenticated user_email="fake@fake.fake" />);
  expect(screen.getByText('fake@fake.fake')).toBeInTheDocument();
  userEvent.click(screen.getByText('fake@fake.fake'));
  // In drop-down:
  expect(screen.getByText('Log Out')).toHaveAttribute('href', '/logout');
});

test('should display User when user_email is empty', () => {
  render(<LoginButton isAuthenticated user_email="" />);
  expect(screen.getByText('User')).toBeInTheDocument();
});
