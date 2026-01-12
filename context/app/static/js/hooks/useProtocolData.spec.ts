import { renderHook } from '@testing-library/react-hooks';

import { useFormattedProtocolUrls, isGithubUrl } from './useProtocolData';

const getResult = (protocols: string, lastVersion: number) => {
  const { result } = renderHook(({ urls, version }) => useFormattedProtocolUrls(urls, version), {
    initialProps: { urls: protocols, version: lastVersion },
  });
  return result.current;
};

describe('useFormattedProtocolUrls', () => {
  it('should format a single URL with no version number', () => {
    const protocolUrls = 'https://dx.doi.org/10.17504/protocols.io.btnfnmbn';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: ['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1'],
      gitHub: [],
    });
  });

  it('should format multiple URLs with version numbers', () => {
    const protocolUrls =
      'https://dx.doi.org/10.17504/protocols.io.btnfnmbn/v1, https://dx.doi.org/10.17504/protocols.io.7d5h6en/v2';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: [
        'https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1',
        'https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.7d5h6en?last_version=1',
      ],
      gitHub: [],
    });
  });

  it('should handle URLs with http:// prefix', () => {
    const protocolUrls = 'http://dx.doi.org/10.17504/protocols.io.btnfnmbn';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: ['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1'],
      gitHub: [],
    });
  });

  it('should handle URLs with https:// prefix', () => {
    const protocolUrls = 'https://dx.doi.org/10.17504/protocols.io.btnfnmbn';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: ['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1'],
      gitHub: [],
    });
  });

  it('should handle URLs with dx.doi.org/ prefix', () => {
    const protocolUrls = 'dx.doi.org/10.17504/protocols.io.btnfnmbn';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: ['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1'],
      gitHub: [],
    });
  });

  it('should handle URLs with multiple prefixes', () => {
    const protocolUrls =
      'https://dx.doi.org/10.17504/protocols.io.btnfnmbn/v1,http://dx.doi.org/10.17504/protocols.io.7d5h6en/v2';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: [
        'https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1',
        'https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.7d5h6en?last_version=1',
      ],
      gitHub: [],
    });
  });

  it('should handle URLs with no http or https prefix', () => {
    const protocolUrls = 'dx.doi.org/10.17504/protocols.io.btnfnmbn/v1';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: ['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1'],
      gitHub: [],
    });
  });

  it('should handle URLs with no version number', () => {
    const protocolUrls = 'https://dx.doi.org/10.17504/protocols.io.btnfnmbn';
    const lastVersion = 2;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: ['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=2'],
      gitHub: [],
    });
  });

  it('should handle empty input', () => {
    const protocolUrls = '';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({ protocols: [], gitHub: [] });
  });

  it('should filter out empty strings from trailing commas', () => {
    const protocolUrls = 'https://dx.doi.org/10.17504/protocols.io.btnfnmbn,';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: ['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1'],
      gitHub: [],
    });
  });

  it('should filter out empty strings from multiple consecutive commas', () => {
    const protocolUrls = 'https://dx.doi.org/10.17504/protocols.io.btnfnmbn,,https://github.com/user/repo';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: ['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1'],
      gitHub: ['https://github.com/user/repo'],
    });
  });

  it('should filter out empty strings from leading and trailing commas', () => {
    const protocolUrls = ',https://dx.doi.org/10.17504/protocols.io.btnfnmbn,';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual({
      protocols: ['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1'],
      gitHub: [],
    });
  });

  describe('GitHub link detection', () => {
    it('should detect a GitHub URL', () => {
      const protocolUrls = 'https://github.com/user/repo';
      const lastVersion = 1;
      const result = getResult(protocolUrls, lastVersion);
      expect(result).toEqual({
        protocols: [],
        gitHub: ['https://github.com/user/repo'],
      });
    });

    it('should detect a GitHub URL with case-insensitive matching', () => {
      const protocolUrls = 'https://GitHub.com/user/repo';
      const lastVersion = 1;
      const result = getResult(protocolUrls, lastVersion);
      expect(result).toEqual({
        protocols: [],
        gitHub: ['https://GitHub.com/user/repo'],
      });
    });

    it('should detect a GitHub URL without protocol', () => {
      const protocolUrls = 'github.com/user/repo/blob/main/README.md';
      const lastVersion = 1;
      const result = getResult(protocolUrls, lastVersion);
      expect(result).toEqual({
        protocols: [],
        gitHub: ['github.com/user/repo/blob/main/README.md'],
      });
    });

    it('should detect a GitHub URL with http protocol', () => {
      const protocolUrls = 'http://github.com/hubmapconsortium/portal-ui';
      const lastVersion = 1;
      const result = getResult(protocolUrls, lastVersion);
      expect(result).toEqual({
        protocols: [],
        gitHub: ['http://github.com/hubmapconsortium/portal-ui'],
      });
    });

    it('should handle multiple GitHub URLs separated by commas', () => {
      const protocolUrls = 'https://github.com/user/repo1, https://github.com/user/repo2';
      const lastVersion = 1;
      const result = getResult(protocolUrls, lastVersion);
      expect(result).toEqual({
        protocols: [],
        gitHub: ['https://github.com/user/repo1', 'https://github.com/user/repo2'],
      });
    });

    it('should handle mixed GitHub and protocol URLs', () => {
      const protocolUrls = 'https://dx.doi.org/10.17504/protocols.io.btnfnmbn, https://github.com/user/repo';
      const lastVersion = 1;
      const result = getResult(protocolUrls, lastVersion);
      expect(result).toEqual({
        protocols: ['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1'],
        gitHub: ['https://github.com/user/repo'],
      });
    });

    it('should handle GitHub URLs interspersed with protocol URLs', () => {
      const protocolUrls =
        'https://github.com/user/repo1, https://dx.doi.org/10.17504/protocols.io.btnfnmbn, https://github.com/user/repo2, dx.doi.org/10.17504/protocols.io.7d5h6en/v1';
      const lastVersion = 1;
      const result = getResult(protocolUrls, lastVersion);
      expect(result).toEqual({
        protocols: [
          'https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1',
          'https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.7d5h6en?last_version=1',
        ],
        gitHub: ['https://github.com/user/repo1', 'https://github.com/user/repo2'],
      });
    });
  });
});

describe('isGithubUrl', () => {
  it('should return true for a standard GitHub URL with https', () => {
    expect(isGithubUrl('https://github.com/user/repo')).toBe(true);
  });

  it('should return true for a GitHub URL with http', () => {
    expect(isGithubUrl('http://github.com/user/repo')).toBe(true);
  });

  it('should return true for a GitHub URL with paths', () => {
    expect(isGithubUrl('https://github.com/hubmapconsortium/portal-ui/blob/main/README.md')).toBe(true);
  });

  it('should return true for case-insensitive GitHub URLs', () => {
    expect(isGithubUrl('https://GitHub.com/user/repo')).toBe(true);
    expect(isGithubUrl('https://GITHUB.COM/user/repo')).toBe(true);
  });

  it('should return true for GitHub subdomain URLs', () => {
    expect(isGithubUrl('https://gist.github.com/user/gist-id')).toBe(true);
    expect(isGithubUrl('https://raw.github.com/user/repo/main/file.txt')).toBe(true);
  });

  it('should return false for URLs without protocol', () => {
    expect(isGithubUrl('github.com/user/repo')).toBe(false);
  });

  it('should return false for non-GitHub URLs', () => {
    expect(isGithubUrl('https://dx.doi.org/10.17504/protocols.io.btnfnmbn')).toBe(false);
    expect(isGithubUrl('https://google.com')).toBe(false);
  });

  it('should return false for URLs containing "github.com" but not as hostname', () => {
    expect(isGithubUrl('https://example.com/path/github.com')).toBe(false);
  });

  it('should return false for invalid URLs', () => {
    expect(isGithubUrl('not a url')).toBe(false);
    expect(isGithubUrl('')).toBe(false);
  });

  it('should return false for URLs with github.com in query string', () => {
    expect(isGithubUrl('https://example.com?url=github.com')).toBe(false);
  });
});
