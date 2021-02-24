/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import SampleTissue from './SampleTissue';

function expectLabelsPresent() {
  expect(screen.getByText('Tissue')).toBeInTheDocument();
  const labelsToTest = ['Organ Type', 'Specimen Type'];
  labelsToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
}

test('text displays properly when all props provided', () => {
  render(<SampleTissue mapped_organ="Fake Organ" mapped_specimen_type="Fake Specimen Type" hasRUI />);
  expectLabelsPresent();

  expect(screen.getByText('Tissue Location')).toBeInTheDocument();

  const valuesToTest = ['Fake Organ', 'Fake Specimen Type'];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});

test('displays label not defined when values are undefined', () => {
  render(<SampleTissue />);
  expectLabelsPresent();

  expect(screen.queryByText('Tissue Location')).not.toBeInTheDocument();

  const valuesToTest = ['Organ Type not defined', 'Specimen Type not defined'];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
