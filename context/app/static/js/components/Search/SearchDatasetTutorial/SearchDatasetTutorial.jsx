import React from 'react';
import Joyride from 'react-joyride';

function SearchDatasetTutorial({ runTutorial }) {
  const steps = [
    {
      target: '#Data-Type .sk-item-list :first-child',
      disableBeacon: true,
      styles: { zIndex: 10000 },
      content:
        'The Dataset Metadata menu on the left side allows filtering datasets by any combination of metadata categories: Data Type, Organ and Specimen Type. Search results update automatically as you edit the selection of filters. ',
    },
  ];

  return <Joyride steps={steps} debug continuous run={runTutorial} />;
}

export default SearchDatasetTutorial;

/*
{
    target: '.my-other-step',
    content: 'Click the View All button to display the entire list of filters in the selected category.',
  },
  {
    target: '.my-other-step',
    content:
      'To further narrow the relevant datasets, type search terms or phrases in “quotes" into the Search bar. Multiple “search terms” should be separated by OR.',
  },
  {
    target: '.my-other-step',
    content: 'Click the View All button to display the entire list of filters in the selected category.',
  },
  {
    target: '.my-other-step',
    content:
      'Press the arrow button by the relevant column to sort search results. A bolded arrow indicates the current sorting selection. Selecting a bolded arrow will reverse the sorting order.',
  },
  {
    target: '.my-other-step',
    content:
      'Toggle the results display mode between list view and tile view. Click the tile view button above to continue.',
  },
  {
    target: '.my-other-step',
    content: 'To sort your search results in grid view, select your sorting option in this dropdown menu.',
  },
  */
