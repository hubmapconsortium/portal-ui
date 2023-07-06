import React from 'react';
import { render, screen } from 'test-utils/functions';
import ErrorBody from './ErrorBody';

const help = { url: 'mailto:help@hubmapconsortium.org', name: 'help@hubmapconsortium.org' };
const login = { url: '/login', name: 'login' };

test('maintenance page', () => {
  render(<ErrorBody isMaintenancePage />);
  expect(screen.getByText('While the portal is under maintenance', { exact: false })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'HuBMAP Consortium' })).toHaveAttribute(
    'href',
    'https://hubmapconsortium.org/',
  );
});

test('Globus 401', () => {
  render(<ErrorBody errorCode={401} isGlobus401 />);
  expect(screen.getByText('Your credentials have expired.', { exact: false })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: login.name })).toHaveAttribute('href', login.url);
});

test('401', () => {
  render(<ErrorBody errorCode={401} />);
  expect(screen.getByText('Could not confirm your Globus credentials.', { exact: false })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: help.name })).toHaveAttribute('href', help.url);
});

test('403 unauthenticated', () => {
  render(<ErrorBody errorCode={403} />);
  expect(screen.getByText('You may not have access to this resource', { exact: false })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: login.name })).toHaveAttribute('href', login.url);
});

test('403 authenticated', () => {
  render(<ErrorBody errorCode={403} isAuthenticated />);
  expect(screen.getByText('You may not have access to this resource', { exact: false })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: help.name })).toHaveAttribute('href', help.url);
});

test('404 UUID length', () => {
  render(<ErrorBody errorCode={404} urlPath="/browse/sample/BAD" />);
  expect(screen.getByText('UUIDs should be 32 characters', { exact: false })).toBeInTheDocument();
});

test('404', () => {
  render(<ErrorBody errorCode={404} urlPath="/anything-else" />);
  expect(screen.getByText('If this page should exist,', { exact: false })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: help.name })).toHaveAttribute('href', help.url);
});

test('all other statuses', () => {
  render(<ErrorBody errorCode={500} />);
  expect(screen.getByText('If this problem persists,', { exact: false })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: help.name })).toHaveAttribute('href', help.url);
});
