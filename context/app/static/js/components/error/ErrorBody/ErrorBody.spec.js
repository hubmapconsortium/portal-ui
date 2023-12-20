import React from 'react';
import { render, screen } from 'test-utils/functions';
import ErrorBody from './ErrorBody';

const help = {
  url: 'https://hubmapconsortium.org/contact-form/',
  name: 'contact us',
  bugReport: 'submit a bug report',
};
const login = { url: '/login', name: 'login' };

jest.mock('react', () => {
  const ReactMock = jest.requireActual('react');
  ReactMock.Suspense = ({ children }) => children;
  ReactMock.lazy = jest.fn().mockImplementation(
    () =>
      function MockedMaintenanceMessage() {
        return (
          <div>
            This is test data <a href="https://hubmapconsortium.org/">HuBMAP Consortium</a>
          </div>
        );
      },
  );
  return ReactMock;
});

test('maintenance page', () => {
  render(<ErrorBody isMaintenancePage />);
  expect(screen.getByText('This is test data')).toBeInTheDocument();
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
  expect(screen.getByRole('link', { name: help.bugReport })).toHaveAttribute('href', help.url);
});

test('all other statuses', () => {
  render(<ErrorBody errorCode={500} />);
  expect(screen.getByText('If this problem persists,', { exact: false })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: help.bugReport })).toHaveAttribute('href', help.url);
});
