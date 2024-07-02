import React from 'react';
import { render, screen } from 'test-utils/functions';
import { FlaskDataContext, FlaskDataContextType } from 'js/components/Contexts';
import SampleTissue from './SampleTissue';

function expectLabelsPresent() {
  expect(screen.getByText('Tissue')).toBeInTheDocument();
  const labelsToTest = ['Organ Type', 'Sample Category'];
  labelsToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
}

test('text displays properly from Flask Context', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      sample_category: 'Fake Sample Category',
      origin_samples: [{ mapped_organ: 'Fake Organ' }],
      rui_location: 'Fake RUI Location',
      entity_type: 'Sample',
    },
  } as unknown as FlaskDataContextType;

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <SampleTissue />
    </FlaskDataContext.Provider>,
  );
  expectLabelsPresent();

  expect(screen.getByText('Tissue Location')).toBeInTheDocument();

  const valuesToTest = ['Fake Organ', 'Fake Sample Category'];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});

test('displays label not defined when values are undefined', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      sample_category: undefined,
      origin_samples: [{ mapped_organ: undefined }],
      rui_location: false,
      entity_type: 'Sample',
    },
  } as unknown as FlaskDataContextType;

  render(
    <FlaskDataContext.Provider value={flaskDataContext}>
      <SampleTissue />
    </FlaskDataContext.Provider>,
  );
  expectLabelsPresent();

  expect(screen.queryByText('Tissue Location')).not.toBeInTheDocument();

  const valuesToTest = ['Organ Type not defined', 'Sample Category not defined'];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
