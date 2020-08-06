/* eslint-disable import/no-unresolved */
import React from 'react';
import { render } from 'test-utils/functions';
import Summary from './Summary';

test('displays correctly with required props', () => {
  const { getByText } = render(<Summary display_doi="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" />);
  const textToTest = ['fakedoi', 'Fakeentity'];
  textToTest.forEach((text) => expect(getByText(text)).toBeInTheDocument());
});

test('timestamps display when defined', () => {
  const { getByText, getAllByText, queryAllByText } = render(
    <Summary
      display_doi="fakedoi"
      entity_type="Fakeentity"
      uuid="fakeuuid"
      create_timestamp={1596724856094}
      last_modified_timestamp={1596724856094}
    />,
  );
  const textToTest = ['Creation Date', 'Modification Date'];
  textToTest.forEach((text) => expect(getByText(text)).toBeInTheDocument());

  expect(getAllByText('Thu Aug 06 2020')).toHaveLength(2);
  expect(queryAllByText('Undefined')).toHaveLength(0);
});

test('timestamps do not display when undefined', () => {
  const { getByText, getAllByText } = render(
    <Summary display_doi="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" />,
  );

  const textToTest = ['Creation Date', 'Modification Date'];
  textToTest.forEach((text) => expect(getByText(text)).toBeInTheDocument());

  expect(getAllByText('Undefined')).toHaveLength(2);
});

test('collection name displays when defined', () => {
  const { getByText } = render(
    <Summary display_doi="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" collectionName="Fake Collection Name" />,
  );

  expect(getByText('Fake Collection Name')).toBeInTheDocument();
});

test('collection name does not display when undefined', () => {
  const { queryByText } = render(<Summary display_doi="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" />);

  expect(queryByText('Fake Collection Name')).toBeNull();
});

test('description displays when defined', () => {
  const { getByText } = render(
    <Summary display_doi="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" description="fake description" />,
  );

  expect(getByText('fake description')).toBeInTheDocument();
});

test('description name does not display when undefined', () => {
  const { queryByText } = render(<Summary display_doi="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" />);

  expect(queryByText('fake description')).toBeNull();
});
