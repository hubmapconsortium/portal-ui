/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import SummaryData from './SummaryData';

test('json button exists and has href', () => {
  render(<SummaryData entity_type="Fake" uuid="fakeuuid" status="QA" mapped_data_access_level="Public" />);

  expect(screen.getByRole('link')).not.toBeEmptyDOMElement();
  expect(screen.getByRole('link')).toHaveAttribute('href', `/browse/fake/fakeuuid.json`);
});

test('dataset displays properly', () => {
  render(<SummaryData entity_type="Dataset" uuid="fakeuuid" status="QA" mapped_data_access_level="Public" />);
  const textToTest = ['QA', 'Public Access'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
  expect(screen.getByTestId('status-svg-icon')).toBeInTheDocument();
});

test('non-dataset displays properly', () => {
  render(<SummaryData entity_type="fake" uuid="fakeuuid" status="QA" mapped_data_access_level="Public" />);
  expect(screen.queryByTestId('status-svg-icon')).toBeNull();
});

test('children display when provided', () => {
  render(
    <SummaryData entity_type="fake" uuid="fakeuuid" status="QA" mapped_data_access_level="Public">
      <>
        <div>child 1</div>
        <div>child 2</div>
      </>
    </SummaryData>,
  );
  expect(screen.getByTestId('summary-data-parent')).toBeInTheDocument();
  expect(screen.getByTestId('summary-data-parent')).not.toBeEmptyDOMElement();

  const textToTest = ['child 1', 'child 2'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});

test('children do not display when undefined', () => {
  render(<SummaryData entity_type="fake" uuid="fakeuuid" status="QA" mapped_data_access_level="Public" />);
  expect(screen.queryByTestId('summary-data-parent')).toBeNull();

  const textToTest = ['child 1', 'child 2'];
  textToTest.forEach((text) => expect(screen.queryByText(text)).toBeNull());
});
