import React from 'react';
import { FlaskDataContext } from 'js/components/Contexts';
import { render, screen } from 'test-utils/functions';
import Summary from './Summary';

test('displays correctly with required props', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Fakeentity',
    },
  };

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary />
    </FlaskDataContext.Provider>,
  );
  const textToTest = ['fakeTitle', 'Fakeentity'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});

test('timestamps display when defined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Fakeentity',
      created_timestamp: 1596724856094,
      last_modified_timestamp: 1596724856094,
    },
  };

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary />
    </FlaskDataContext.Provider>,
  );
  const textToTest = ['Creation Date', 'Last Modified'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  expect(screen.getAllByText('2020-08-06')).toHaveLength(2);
  expect(screen.queryByText('Undefined')).not.toBeInTheDocument();
});

test('publication prefered to creation, if available', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Fakeentity',
      created_timestamp: 1596724856094,
      last_modified_timestamp: 1596724856094,
    },
  };

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary published_timestamp={1596724856094} />
    </FlaskDataContext.Provider>,
  );
  const textToTest = ['Publication Date', 'Last Modified'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  expect(screen.getAllByText('2020-08-06')).toHaveLength(2);
  expect(screen.queryByText('Undefined')).not.toBeInTheDocument();
});

test('timestamps do not display when undefined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Fakeentity',
    },
  };

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary />
    </FlaskDataContext.Provider>,
  );

  const textToTest = ['Creation Date', 'Last Modified'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());

  expect(screen.getAllByText('Undefined')).toHaveLength(2);
});

test('collection name displays when defined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Fakeentity',
    },
  };

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary collectionName="Fake Collection Name" />
    </FlaskDataContext.Provider>,
  );

  expect(screen.getByText('Fake Collection Name')).toBeInTheDocument();
});

test('collection name does not display when undefined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Fakeentity',
    },
  };

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary />
    </FlaskDataContext.Provider>,
  );

  expect(screen.queryByText('Fake Collection Name')).not.toBeInTheDocument();
});

test('description displays when defined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Fakeentity',
      description: 'fake description',
    },
  };

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary />
    </FlaskDataContext.Provider>,
  );

  expect(screen.getByText('fake description')).toBeInTheDocument();
});

test('description name does not display when undefined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Fakeentity',
    },
  };

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary />
    </FlaskDataContext.Provider>,
  );

  expect(screen.queryByText('fake description')).not.toBeInTheDocument();
});
