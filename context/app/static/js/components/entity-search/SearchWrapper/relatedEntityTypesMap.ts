export default {
  donor: ['donor'],
  sample: ['donor', 'sample'],
  dataset: ['donor', 'sample', 'dataset'],
} as Record<'donor' | 'sample' | 'dataset', string[]>;
