import React from 'react';
import { FlaskDataContext, FlaskDataContextType } from 'js/components/Contexts';
import { render, screen } from 'test-utils/functions';
import { Collection, Dataset, Publication } from 'js/components/types';
import Summary from './Summary';

const testStatusAndAccessLevel = {
  status: 'fakeStatus',
  mapped_data_access_level: 'fakeAccessLevel',
};

describe('Summary', () => {
  let location: Location;
  const mockLocation = new URL('https://example.com') as unknown as Location;

  beforeEach(() => {
    location = window.location;
    mockLocation.replace = jest.fn();
    mockLocation.assign = jest.fn();
    mockLocation.reload = jest.fn();
    mockLocation.search = 'mockSearch';
    mockLocation.hash = 'mockHash';
    // @ts-expect-error - This for a test mock.
    delete window.location;
    window.location = mockLocation as unknown as string & Location;
  });

  afterEach(() => {
    window.location = location as unknown as string & Location;
  });

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
    textToTest.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test('publication preferred to creation, if available', () => {
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

    expect(screen.getByText('Last Modified')).toBeInTheDocument();
    expect(screen.getAllByText('N/A')).toHaveLength(1);
  });

  test('collection name displays when defined', () => {
    const flaskDataContext = {
      entity: {
        uuid: 'fakeUUID',
        hubmap_id: 'fakeHubmapID',
        entity_type: 'Collection',
        last_modified_timestamp: 1746631808,
      } as Collection,
    } as FlaskDataContextType;

    render(
      <FlaskDataContext.Provider value={flaskDataContext}>
        <Summary title="Fake Collection Name" {...testStatusAndAccessLevel} />
      </FlaskDataContext.Provider>,
    );

    expect(screen.getByText('Fake Collection Name')).toBeInTheDocument();
  });

  test('collection name does not display when undefined', () => {
    const flaskDataContext = {
      entity: {
        uuid: 'fakeUUID',
        hubmap_id: 'fakeHubmapID',
        entity_type: 'Collection',
        last_modified_timestamp: 1746631808,
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
});
