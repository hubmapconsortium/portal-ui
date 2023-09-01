import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from 'test-utils/functions';

import FileBrowserDUA from './FileBrowserDUA';

const handleAgreeFn = jest.fn();
const handleCloseFn = jest.fn();
const mapped_data_access_level = 'fakeaccess';

function TestFileBrowserDUA({
  isOpen = true,
  accessLevel = mapped_data_access_level,
  handleAgree = handleAgreeFn,
  handleClose = handleCloseFn,
}) {
  return (
    <FileBrowserDUA
      isOpen={isOpen}
      handleAgree={handleAgree}
      handleClose={handleClose}
      mapped_data_access_level={accessLevel}
    />
  );
}

const duaModal = {
  get dialog() {
    return screen.queryByRole('dialog');
  },
  buttons: {
    get disagree() {
      return screen.getByRole('button', { name: 'Disagree' });
    },
    get agree() {
      return screen.getByRole('button', { name: 'Agree' });
    },
  },
  dialogTitle: {
    get public() {
      return screen.getByText(/Public/);
    },
    get consortium() {
      return screen.getByText(/Controlled/);
    },
    get protected() {
      return screen.getAllByText(/Genomic Sequence/i);
    },
  },
  duaText: {
    get public() {
      return screen.getByText(
        'By downloading HuBMAP raw or processed data and using this data alone or combined with any other information',
        { exact: false },
      );
    },
    get consortium() {
      return screen.getByText('You are attempting to download data accessible only to HuBMAP Members.', {
        exact: false,
      });
    },
    get protected() {
      return screen.getByText('Access to these data will be made available in dbGAP for non-consortium members.', {
        exact: false,
      });
    },
  },
  checkbox: {
    get byLabel() {
      return screen.getByLabelText('I have read and agree to the above data use guidelines.');
    },
    get byRole() {
      return screen.getByRole('checkbox');
    },
  },
};

test('autofocused on disagree button', () => {
  render(<TestFileBrowserDUA />);

  expect(duaModal.buttons.disagree).toHaveFocus();
});

test('displays when isOpen prop is true', () => {
  render(<TestFileBrowserDUA />);

  expect(duaModal.dialog).toBeInTheDocument();
});

test('does not display when isOpen prop is false', () => {
  render(<TestFileBrowserDUA isOpen={false} />);

  expect(duaModal.dialog).not.toBeInTheDocument();
});

test('displays correct text for protected access level', () => {
  render(<TestFileBrowserDUA accessLevel="Protected" />);

  expect(duaModal.dialogTitle.protected).toHaveLength(2);
  expect(duaModal.duaText.protected).toBeInTheDocument();
});

test('displays correct text for consortium access level', () => {
  render(<TestFileBrowserDUA accessLevel="Consortium" />);

  expect(duaModal.dialogTitle.consortium).toBeInTheDocument();
  expect(duaModal.duaText.consortium).toBeInTheDocument();
});

test('displays correct text for when access level is not protected or consortium', () => {
  render(<TestFileBrowserDUA />);

  expect(duaModal.dialogTitle.public).toBeInTheDocument();
  expect(duaModal.duaText.public).toBeInTheDocument();
});

test('handles agree flow', () => {
  const mockAgree = jest.fn();
  render(<TestFileBrowserDUA handleAgree={mockAgree} />);

  expect(duaModal.checkbox.byLabel).not.toBeChecked();
  expect(duaModal.buttons.agree).toBeDisabled();
  userEvent.click(duaModal.checkbox.byRole);
  expect(duaModal.checkbox.byLabel).toBeChecked();
  expect(duaModal.buttons.agree).toBeEnabled();
  userEvent.click(duaModal.buttons.agree);
  expect(mockAgree).toHaveBeenCalledTimes(1);
});

test('calls handleClose when disagree button is clicked', () => {
  const mockClose = jest.fn();
  render(<TestFileBrowserDUA handleClose={mockClose} />);

  expect(mockClose).toHaveBeenCalledTimes(0);
  userEvent.click(duaModal.buttons.disagree);
  expect(mockClose).toHaveBeenCalledTimes(1);
});
