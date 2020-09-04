/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import SampleTissue from './SampleTissue';

test('text displays properly when all props provided', () => {
  render(<SampleTissue mapped_organ="Fake Organ" mapped_specimen_type="Fake Specimen Type" />);

  expect(screen.getByText('Tissue')).toBeInTheDocument();

  const labelsToTest = ['Organ Type', 'Specimen Type', 'Tissue Location'];
  labelsToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  const valuesToTest = ['Fake Organ', 'Fake Specimen Type'];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
  expect(
    screen.getByText('Common Coordinate Framework Exploration User Interface', {
      exact: false,
    }),
  ).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/ccf-eui');
});

test('displays label not defined when values are undefined', () => {
  render(<SampleTissue />);

  expect(screen.getByText('Tissue')).toBeInTheDocument();

  const labelsToTest = ['Organ Type', 'Specimen Type', 'Tissue Location'];
  labelsToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  const valuesToTest = ['Organ Type not defined', 'Specimen Type not defined'];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
