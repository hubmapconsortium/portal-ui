import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'test-utils/functions';

import FileBrowserDUA from './FileBrowserDUA';

const handleAgree = jest.fn();
const handleClose = jest.fn();
const mapped_data_access_level = 'fakeaccess';

test('autofocused on disagree button', () => {
  render(
    <FileBrowserDUA
      isOpen
      handleAgree={handleAgree}
      handleClose={handleClose}
      mapped_data_access_level={mapped_data_access_level}
    />,
  );

  expect(screen.getByRole('button', { name: 'Disagree' })).toHaveFocus();
});

test('does not display when isOpen prop is false', () => {
  render(
    <FileBrowserDUA
      isOpen={false}
      handleAgree={handleAgree}
      handleClose={handleClose}
      mapped_data_access_level={mapped_data_access_level}
    />,
  );

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('displays correct text for protected access level', () => {
  render(
    <FileBrowserDUA isOpen handleAgree={handleAgree} handleClose={handleClose} mapped_data_access_level="Protected" />,
  );

  expect(screen.getAllByText(/Genomic Sequence/i)).toHaveLength(2);
});

test('displays correct text for consortium access level', () => {
  render(
    <FileBrowserDUA isOpen handleAgree={handleAgree} handleClose={handleClose} mapped_data_access_level="Consortium" />,
  );

  expect(screen.getByText(/Controlled/)).toBeInTheDocument();
  expect(
    screen.getByText('You are attempting to download data accessible only to HuBMAP Members.', { exact: false }),
  ).toBeInTheDocument();
});

test('displays correct text for when access level is not protected or consortium', () => {
  render(
    <FileBrowserDUA
      isOpen
      handleAgree={handleAgree}
      handleClose={handleClose}
      mapped_data_access_level={mapped_data_access_level}
    />,
  );

  expect(screen.getByText(/Public/)).toBeInTheDocument();
  expect(
    screen.getByText(
      'By downloading HuBMAP raw or processed data and using this data alone or combined with any other information',
      { exact: false },
    ),
  ).toBeInTheDocument();
});

test('handles agree flow', () => {
  const mockAgree = jest.fn();
  render(
    <FileBrowserDUA
      isOpen
      handleAgree={mockAgree}
      handleClose={handleClose}
      mapped_data_access_level={mapped_data_access_level}
    />,
  );

  expect(screen.getByLabelText('I have read and agree to the above data use guidelines.')).not.toBeChecked();
  expect(screen.getByRole('button', { name: 'Agree' })).toBeDisabled();
  userEvent.click(screen.getByRole('checkbox'));
  expect(screen.getByLabelText('I have read and agree to the above data use guidelines.')).toBeChecked();
  expect(screen.getByRole('button', { name: 'Agree' })).toBeEnabled();
  userEvent.click(screen.getByRole('button', { name: 'Agree' }));
  expect(mockAgree).toHaveBeenCalledTimes(1);
});

test('calls handleClose when disagree button is clicked', () => {
  const mockClose = jest.fn();
  render(
    <FileBrowserDUA
      isOpen
      handleAgree={handleAgree}
      handleClose={mockClose}
      mapped_data_access_level={mapped_data_access_level}
    />,
  );

  expect(mockClose).toHaveBeenCalledTimes(0);
  userEvent.click(screen.getByRole('button', { name: 'Disagree' }));
  expect(mockClose).toHaveBeenCalledTimes(1);
});
