/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import DonorMetadata from './DonorMetadata';

test('text displays properly when metadata prop contains data', () => {
  const metadata = { sex: 'Test Sex', age: 30, bmi: 25, race: 'Test Race' };
  render(<DonorMetadata metadata={metadata} />);

  expect(screen.getByText('Metadata')).toBeInTheDocument();

  const labelsToTest = ['Sex', 'Current Chronological Age', 'Body Mass Index', 'Racial Group'];
  labelsToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  const valuesToTest = ['Test Sex', '30', '25', 'Test Race'];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});

test('text displays properly when metadata prop is empty', () => {
  const metadata = {};
  render(<DonorMetadata metadata={metadata} />);

  expect(screen.getByText('Metadata')).toBeInTheDocument();

  const labelsToTest = ['Sex', 'Current Chronological Age', 'Body Mass Index', 'Racial Group'];
  labelsToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  const valuesToTest = [
    'Sex not defined',
    'Current Chronological Age not defined',
    'Body Mass Index not defined',
    'Racial Group not defined',
  ];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
