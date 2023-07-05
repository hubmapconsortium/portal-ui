import React from 'react';
import { render, screen } from 'test-utils/functions';
import { fireEvent } from '@testing-library/react';

import UserLinks from './UserLinks';

test('should be "User Profile" when not authenticated', () => {
  render(<UserLinks isAuthenticated={false} />);
  expect(screen.getByText('User Profile')).toBeInTheDocument();
  fireEvent.click(screen.getByText('User Profile'));
  // In drop-down:
  expect(screen.getByText('My Lists')).toBeInTheDocument();
  expect(screen.getByText('Log In')).toBeInTheDocument();
  expect(screen.queryByText('Log Out')).not.toBeInTheDocument();
});

test('should be logout button when authenticated', () => {
  render(<UserLinks isAuthenticated userEmail="fake@fake.fake" />);
  expect(screen.getByText('fake@fake.fake')).toBeInTheDocument();
  fireEvent.click(screen.getByText('fake@fake.fake'));
  // In drop-down:
  expect(screen.getByText('My Lists')).toBeInTheDocument();
  expect(screen.getByText('Log Out')).toBeInTheDocument();
  expect(screen.queryByText('Log In')).not.toBeInTheDocument();
});

test('should display User when userEmail is empty', () => {
  render(<UserLinks isAuthenticated userEmail="" />);
  expect(screen.getByText('User')).toBeInTheDocument();
});
