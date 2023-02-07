const steps = [
  {
    target: '#cells-steps-0',
    disableBeacon: true,
    content:
      'Select your desired query from the list of selections. After making a selection, the “Set Parameters” button will become active for you to proceed.',
    title: 'Select a Query Type',
    placement: 'bottom',
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
  {
    target: '#cells-steps-2 tbody > tr:nth-child(1) > td:nth-child(9)',
    content:
      'The first result will always be automatically expanded to view relevant visualizations. To view or collapse relevant visualizations for other datasets, click the arrow icon. Only one expanded view can be loaded at a time.',
    title: 'Expand Results for Visualizations',
    disableBeacon: true,
  },
];

export { steps };
