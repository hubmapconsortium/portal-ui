import React from 'react';
import { FlaskDataContext, FlaskDataContextType } from 'js/components/Contexts';
import { render, screen } from 'test-utils/functions';
import { Collection, Dataset, Publication } from 'js/components/types';
import Summary from './Summary';

const testStatusAndAccessLevel = {
  status: 'fakeStatus',
  mapped_data_access_level: 'fakeAccessLevel',
};

test('displays correctly with required props', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Publication',
    } as Publication,
  } as FlaskDataContextType;

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary {...testStatusAndAccessLevel} />
    </FlaskDataContext.Provider>,
  );
  const textToTest = ['fakeTitle', 'Publication'];
  textToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});

test('publication prefered to creation, if available', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Dataset',
      created_timestamp: 1596724856094,
      published_timestamp: 1596724856094,
    } as Dataset,
  } as FlaskDataContextType;

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary {...testStatusAndAccessLevel} />
    </FlaskDataContext.Provider>,
  );
  expect(screen.getByText('Publication Date')).toBeInTheDocument();
  expect(screen.getAllByText('2020-08-06')).toHaveLength(1);
  expect(screen.queryByText('Undefined')).not.toBeInTheDocument();
});

test('timestamps do not display when undefined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Dataset',
    } as Dataset,
  } as FlaskDataContextType;

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary {...testStatusAndAccessLevel} />
    </FlaskDataContext.Provider>,
  );

  expect(screen.getByText('Creation Date')).toBeInTheDocument();
  expect(screen.getAllByText('Undefined')).toHaveLength(1);
});

test('collection name displays when defined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Collection',
      title: 'Fake Collection Name',
    } as Collection,
  } as FlaskDataContextType;

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary {...testStatusAndAccessLevel} />
    </FlaskDataContext.Provider>,
  );

  expect(screen.getByText('Fake Collection Name')).toBeInTheDocument();
});

test('collection name does not display when undefined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Collection',
    } as Collection,
  } as FlaskDataContextType;

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary {...testStatusAndAccessLevel} />
    </FlaskDataContext.Provider>,
  );

  expect(screen.queryByText('Fake Collection Name')).not.toBeInTheDocument();
});

test('description displays when defined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      description: 'fake description',
      entity_type: 'Dataset',
    } as Dataset,
  } as FlaskDataContextType;

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary {...testStatusAndAccessLevel} />
    </FlaskDataContext.Provider>,
  );

  expect(screen.getByText('fake description')).toBeInTheDocument();
});

test('description name does not display when undefined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      hubmap_id: 'fakeTitle',
      entity_type: 'Dataset',
    } as Dataset,
  } as FlaskDataContextType;

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <Summary {...testStatusAndAccessLevel} />
    </FlaskDataContext.Provider>,
  );

  expect(screen.queryByText('fake description')).not.toBeInTheDocument();
});
