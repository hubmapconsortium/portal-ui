const steps = [
  {
    target: '#cells-steps-0',
    disableBeacon: true,
    content:
      'Select your desired query from the list of selections. After making a selection, the “Set Parameters” button will become active for you to proceed.',
    title: 'Select a Query Type',
    placement: 'bottom-start',
  },
  {
    target: '#cells-steps-1',
    content:
      'Fill in all required fields and press the “Run Query” button to run your query. Parameters might look different depending on your selected query type.',
    disableBeacon: true,
    title: 'Fill in Parameters',
  },
  {
    target: '#cells-steps-2-summary',
    disableBeacon: true,
    content:
      'If available, results should load with the first result expanded. If no results are valid with your search, return to the Parameters section by clicking the parameter section to change your selections.',
    title: 'View Results',
    placement: 'left',
  },
  /*
  {
    target: 'tbody tr:first-of-type td:last-child svg', // update
    content:
      'The first result will always be automatically expanded to view relevant visualizations. To view or collapse relevant visualizations for other datasets, click the arrow icon. Only one expanded view can be loaded at a time.',
    title: 'Expand Results for Visualizations',
    disableBeacon: true,
  },
    {
      target: '#search-tiles-sort-button', // update
      content:
        'You can add datasets to a list by checking the checkbox next to a dataset. Select the checkbox in the header to select all datasets on the current page. After making your selection, press the “Add to List” button on the upper right corner of this panel.',
      disableBeacon: true,
      title: 'Add Results to List (5/6)',
    },
    {
      target: '#search-tiles-sort-button', // update
      content:
        'After your results load, you can navigate to any of the previous steps (dataset selection, query type selection, parameters) to run a new query on different parameters. Your new query will not load immediately. To run a new query, press the “Rerun your query” button in the warning banner or the “Run Query” button in the Parameters step.',
      disableBeacon: true,
      title: 'Changing Parameters or Query Type',
    },
      */
];

export { steps };
