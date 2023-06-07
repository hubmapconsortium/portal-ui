/* eslint-disable import/no-unresolved */
import React from 'react';
import { render, screen } from 'test-utils/functions';
import Summary from './Summary';

test('displays correctly with required props', () => {
  const { getByText } = render(<Summary title="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" />);
  const textToTest = ['fakedoi', 'Fakeentity'];
  textToTest.forEach((text) => expect(getByText(text)).toBeInTheDocument());
});

test('timestamps display when defined', () => {
  render(
    <Summary
      title="fakedoi"
      entity_type="Fakeentity"
      uuid="fakeuuid"
      created_timestamp={1596724856094}
      last_modified_timestamp={1596724856094}
    />,
  );
  const textToTest = ['Creation Date', 'Modification Date'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  expect(screen.getAllByText('2020-08-06')).toHaveLength(2);
  expect(screen.queryAllByText('Undefined')).toHaveLength(0);
});

test('publication prefered to creation, if available', () => {
  render(
    <Summary
      title="fakedoi"
      entity_type="Fakeentity"
      uuid="fakeuuid"
      created_timestamp={1596724856094}
      published_timestamp={1596724856094}
      last_modified_timestamp={1596724856094}
    />,
  );
  const textToTest = ['Publication Date', 'Modification Date'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  expect(screen.getAllByText('2020-08-06')).toHaveLength(2);
  expect(screen.queryAllByText('Undefined')).toHaveLength(0);
});

test('timestamps do not display when undefined', () => {
  render(<Summary title="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" />);

  const textToTest = ['Creation Date', 'Modification Date'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  expect(screen.getAllByText('Undefined')).toHaveLength(2);
});

test('collection name displays when defined', () => {
  render(<Summary title="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" collectionName="Fake Collection Name" />);

  expect(screen.getByText('Fake Collection Name')).toBeInTheDocument();
});

test('collection name does not display when undefined', () => {
  render(<Summary title="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" />);

  expect(screen.queryByText('Fake Collection Name')).toBeNull();
});

test('description displays when defined', () => {
  render(<Summary title="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" description="fake description" />);

  expect(screen.getByText('fake description')).toBeInTheDocument();
});

test('description name does not display when undefined', () => {
  render(<Summary title="fakedoi" entity_type="Fakeentity" uuid="fakeuuid" />);

  expect(screen.queryByText('fake description')).toBeNull();
});
