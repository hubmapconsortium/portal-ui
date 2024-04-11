import { processDagList, getGithubRepoName } from './hooks';

describe('getGithubRepoName', () => {
  it('should return the repo name from a GitHub URL', () => {
    expect(getGithubRepoName('https://github.com/hubmapconsortium/portal-ui')).toBe('portal-ui');
    expect(getGithubRepoName('https://github.com/hubmapconsortium/portal-containers')).toBe('portal-containers');
    expect(getGithubRepoName('https://github.com/hubmapconsortium/salmon-rnaseq')).toBe('salmon-rnaseq');
  });
  it('should return the origin if the URL is not a GitHub URL', () => {
    expect(getGithubRepoName('https://hubmapconsortium.org')).toBe('https://hubmapconsortium.org');
  });
});

const testDAG = [
  {
    hash: '7a5be2c',
    origin: 'https://github.com/hubmapconsortium/ingest-pipeline.git',
  },
  {
    hash: '7a5be2c',
    origin: 'https://github.com/hubmapconsortium/ingest-pipeline.git',
  },
  {
    hash: '1efc094',
    name: 'pipeline.cwl',
    origin: 'https://github.com//hubmapconsortium/celldive-pipeline',
  },
  {
    hash: '62d3a80',
    name: 'pipeline.cwl',
    origin: 'https://github.com/hubmapconsortium/sprm',
  },
  {
    hash: '6e55233',
    name: 'pipeline.cwl',
    origin: 'https://github.com/hubmapconsortium/create-vis-symlink-archive',
  },
  {
    hash: 'b1b40c4',
    name: 'pipeline.cwl',
    origin: 'https://github.com/hubmapconsortium/ome-tiff-pyramid',
  },
  {
    hash: '1994f0f',
    name: 'sprm-to-anndata.cwl',
    origin: 'https://github.com/hubmapconsortium/portal-containers',
  },
];

describe('processDagList', () => {
  it('should return the most recent non-portal container origin and name from a list of DAGs', () => {
    const result = testDAG.reduce(processDagList, { name: 'pipeline.cwl', origin: '' });
    expect(result).toEqual({
      name: 'ome-tiff-pyramid',
      origin: 'https://github.com/hubmapconsortium/ome-tiff-pyramid',
    });
  });
});
