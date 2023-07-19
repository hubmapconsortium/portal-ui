import React from 'react';
import { render, screen } from 'test-utils/functions';
import { FlaskDataContext } from 'js/components/Contexts';
import SampleTissue from './SampleTissue';

function expectLabelsPresent() {
  expect(screen.getByText('Tissue')).toBeInTheDocument();
  const labelsToTest = ['Organ Type', 'Sample Category'];
  labelsToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
}

test('text displays properly when all props provided', () => {
  const flaskDataContext = {
    entity: {
      uuid: 'fakeUUID',
      sample_category: 'Fake Sample Category',
      origin_samples: { mapped_organ: 'Fake Origin Sample' },
      rui_location: 'Fake RUI Location',
    },
  };

  render(
    <FlaskDataContext value={flaskDataContext}>
      <SampleTissue />
    </FlaskDataContext>,
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
      sample_category: 'Fake Sample Category',
      origin_samples: { mapped_organ: 'Fake Origin Sample' },
      rui_location: 'Fake RUI Location',
    },
  };

  render(
    <FlaskDataContext value={flaskDataContext}>
      <SampleTissue />
    </FlaskDataContext>,
  );
  expectLabelsPresent();

  expect(screen.queryByText('Tissue Location')).not.toBeInTheDocument();

  const valuesToTest = ['Organ Type not defined', 'Sample Category not defined'];
  valuesToTest.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
});
