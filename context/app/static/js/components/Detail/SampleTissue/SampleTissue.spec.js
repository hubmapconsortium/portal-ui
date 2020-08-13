/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import SampleTissue from './SampleTissue';

test('text displays properly when all props provided', () => {
  render(
    <SampleTissue
      mapped_organ="Fake Organ"
      mapped_specimen_type="Fake Specimen Type"
      tissueLocation="Fake Tissue Location"
    />,
  );

  expect(screen.getByText('Tissue')).toBeInTheDocument();

  const labelsToTest = ['Organ Type', 'Specimen Type', 'Tissue Location'];
  labelsToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  const valuesToTest = ['Fake Organ', 'Fake Specimen Type', 'Fake Tissue Location'];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});

test('text displays properly when tissue location is not provided', () => {
  render(<SampleTissue mapped_organ="Fake Organ" mapped_specimen_type="Fake Specimen Type" />);

  expect(screen.getByText('Tissue')).toBeInTheDocument();

  const labelsToTest = ['Organ Type', 'Specimen Type', 'Tissue Location'];
  labelsToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  const valuesToTest = ['Fake Organ', 'Fake Specimen Type', 'Tissue Location not defined'];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
