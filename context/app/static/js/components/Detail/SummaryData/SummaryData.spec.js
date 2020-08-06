/* eslint-disable import/no-unresolved */
import React from 'react';
import { render } from 'test-utils/functions';
import SummaryData from './SummaryData';

test('json button exists and has href', () => {
  const { getByRole } = render(
    <SummaryData entity_type="Fake" uuid="fakeuuid" status="QA" mapped_data_access_level="Public" />,
  );
  expect(getByRole('link')).toBeInTheDocument();
  expect(getByRole('link')).not.toBeEmptyDOMElement();
  expect(getByRole('link')).toHaveAttribute('href', `/browse/fake/fakeuuid.json`);
});

test('dataset displays properly', () => {
  const { getByText, getByTestId } = render(
    <SummaryData entity_type="Dataset" uuid="fakeuuid" status="QA" mapped_data_access_level="Public" />,
  );
  const textToTest = ['QA', 'Public Access'];
  textToTest.forEach((text) => expect(getByText(text)).toBeInTheDocument());
  expect(getByTestId('status-svg-icon')).toBeInTheDocument();
});

test('non-dataset displays properly', () => {
  const { queryByTestId } = render(
    <SummaryData entity_type="fake" uuid="fakeuuid" status="QA" mapped_data_access_level="Public" />,
  );
  expect(queryByTestId('status-svg-icon')).toBeNull();
});

test('children display when provided', () => {
  const { getByText, getByTestId } = render(
    <SummaryData entity_type="fake" uuid="fakeuuid" status="QA" mapped_data_access_level="Public">
      <>
        <div>child 1</div>
        <div>child 2</div>
      </>
    </SummaryData>,
  );
  expect(getByTestId('summary-data-parent')).toBeInTheDocument();
  expect(getByTestId('summary-data-parent')).not.toBeEmptyDOMElement();

  const textToTest = ['child 1', 'child 2'];
  textToTest.forEach((text) => expect(getByText(text)).toBeInTheDocument());
});

test('children do not display when undefined', () => {
  const { queryByText, queryByTestId } = render(
    <SummaryData entity_type="fake" uuid="fakeuuid" status="QA" mapped_data_access_level="Public" />,
  );
  expect(queryByTestId('summary-data-parent')).toBeNull();

  const textToTest = ['child 1', 'child 2'];
  textToTest.forEach((text) => expect(queryByText(text)).toBeNull());
});
