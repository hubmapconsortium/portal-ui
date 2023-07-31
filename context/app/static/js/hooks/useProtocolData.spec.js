import { renderHook } from '@testing-library/react-hooks';

import { useFormattedProtocolUrls } from './useProtocolData';

const getResult = (protocols, lastVersion) => {
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
    expect(result).toEqual(['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1']);
  });

  it('should format multiple URLs with version numbers', () => {
    const protocolUrls =
      'https://dx.doi.org/10.17504/protocols.io.btnfnmbn/v1, https://dx.doi.org/10.17504/protocols.io.7d5h6en/v2';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual([
      'https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1',
      'https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.7d5h6en?last_version=1',
    ]);
  });

  it('should handle URLs with http:// prefix', () => {
    const protocolUrls = 'http://dx.doi.org/10.17504/protocols.io.btnfnmbn';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual(['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1']);
  });

  it('should handle URLs with https:// prefix', () => {
    const protocolUrls = 'https://dx.doi.org/10.17504/protocols.io.btnfnmbn';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual(['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1']);
  });

  it('should handle URLs with dx.doi.org/ prefix', () => {
    const protocolUrls = 'dx.doi.org/10.17504/protocols.io.btnfnmbn';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual(['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1']);
  });

  it('should handle URLs with multiple prefixes', () => {
    const protocolUrls =
      'https://dx.doi.org/10.17504/protocols.io.btnfnmbn/v1,http://dx.doi.org/10.17504/protocols.io.7d5h6en/v2';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual([
      'https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1',
      'https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.7d5h6en?last_version=1',
    ]);
  });

  it('should handle URLs with no http or https prefix', () => {
    const protocolUrls = 'dx.doi.org/10.17504/protocols.io.btnfnmbn/v1';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual(['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=1']);
  });

  it('should handle URLs with no version number', () => {
    const protocolUrls = 'https://dx.doi.org/10.17504/protocols.io.btnfnmbn';
    const lastVersion = 2;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual(['https://www.protocols.io/api/v4/protocols/10.17504/protocols.io.btnfnmbn?last_version=2']);
  });

  it('should handle empty input', () => {
    const protocolUrls = '';
    const lastVersion = 1;
    const result = getResult(protocolUrls, lastVersion);
    expect(result).toEqual([]);
  });
});
