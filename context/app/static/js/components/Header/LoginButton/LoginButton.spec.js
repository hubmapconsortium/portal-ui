/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';

import LoginButton from './LoginButton';

test('should be login button when not authenticated', () => {
  render(<LoginButton isAuthenticated={false} />);
  expect(screen.getByText('login')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/login');
});

test('should be logout button when authenticated', () => {
  render(<LoginButton isAuthenticated />);
  expect(screen.getByText('logout')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/logout');
});
