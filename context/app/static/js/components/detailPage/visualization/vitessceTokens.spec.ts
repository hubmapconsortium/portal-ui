import LZString from 'lz-string';

import {
  SHARED_TOKEN_PLACEHOLDER,
  containsCredentials,
  replaceTokenWithPlaceholder,
  restoreTokenFromPlaceholder,
  sharedConfNeedsCredentials,
} from './vitessceTokens';

// Mirrors the three real credential shapes at once: a `?token=` param on a top-level `url`, the same
// on a deeply nested `omeTiffOffsetsUrl`, and a `requestInit.headers.Authorization` header.
const confWithToken = (token: string) => ({
  name: 'conf1',
  datasets: [
    {
      files: [
        {
          fileType: 'image.ome-tiff',
          url: `https://a/x.ome.tif?token=${token}`,
          options: {
            images: [{ metadata: { omeTiffOffsetsUrl: `https://a/x.offsets.json?token=${token}` } }],
          },
        },
        {
          fileType: 'anndata.zarr',
          url: 'https://a/y.zarr',
          requestInit: { headers: { Authorization: `Bearer ${token}` } },
        },
      ],
    },
  ],
});

interface StrippedFile {
  url: string;
  requestInit?: unknown;
  options?: { images: { metadata: { omeTiffOffsetsUrl: string } }[] };
}
const filesOf = (conf: unknown) => (conf as { datasets: { files: StrippedFile[] }[] }).datasets[0].files;

describe('replaceTokenWithPlaceholder / restoreTokenFromPlaceholder', () => {
  test('round-trips a config from one viewer to another', () => {
    const shared = replaceTokenWithPlaceholder(confWithToken('abc'), 'abc');
    const serialized = JSON.stringify(shared);

    expect(serialized).not.toContain('abc');
    // All three credential positions carry the placeholder.
    expect(serialized.split(SHARED_TOKEN_PLACEHOLDER)).toHaveLength(4);

    expect(restoreTokenFromPlaceholder(shared, 'xyz')).toEqual(confWithToken('xyz'));
  });

  test('strips credentials entirely for a viewer with no token', () => {
    const shared = replaceTokenWithPlaceholder(confWithToken('abc'), 'abc');
    const conf = restoreTokenFromPlaceholder(shared, '');

    const [imageFile, zarrFile] = filesOf(conf);
    // No dangling `?`, and the header is gone rather than left as an empty bearer.
    expect(imageFile.url).toBe('https://a/x.ome.tif');
    expect(imageFile.options?.images[0].metadata.omeTiffOffsetsUrl).toBe('https://a/x.offsets.json');
    expect(zarrFile).not.toHaveProperty('requestInit');

    const serialized = JSON.stringify(conf);
    expect(serialized).not.toContain(SHARED_TOKEN_PLACEHOLDER);
    expect(serialized).not.toContain('abc');
  });

  test('keeps other headers, pruning only the credential', () => {
    const shared = {
      requestInit: {
        headers: { Authorization: `Bearer ${SHARED_TOKEN_PLACEHOLDER}`, 'Content-Type': 'application/json' },
      },
    };
    expect(restoreTokenFromPlaceholder(shared, '')).toEqual({
      requestInit: { headers: { 'Content-Type': 'application/json' } },
    });
  });

  test('leaves a well-formed URL whatever position the token param is in', () => {
    const shared = {
      only: `https://a/x?${`token=${SHARED_TOKEN_PLACEHOLDER}`}`,
      first: `https://a/x?token=${SHARED_TOKEN_PLACEHOLDER}&z=1`,
      last: `https://a/x?z=1&token=${SHARED_TOKEN_PLACEHOLDER}`,
    };

    expect(restoreTokenFromPlaceholder(shared, '')).toEqual({
      only: 'https://a/x',
      first: 'https://a/x?z=1',
      last: 'https://a/x?z=1',
    });
  });

  test('preserves array indices, since Vitessce coordinates by them', () => {
    const shared = {
      datasets: [
        { name: 'conf1' },
        { requestInit: { headers: { Authorization: `Bearer ${SHARED_TOKEN_PLACEHOLDER}` } } },
      ],
    };
    // The emptied element stays at its index rather than being filtered out.
    expect(restoreTokenFromPlaceholder(shared, '')).toEqual({ datasets: [{ name: 'conf1' }, {}] });
  });

  test('keeps objects that were already empty', () => {
    const shared = {
      options: {},
      requestInit: { headers: { Authorization: `Bearer ${SHARED_TOKEN_PLACEHOLDER}` } },
    };
    expect(restoreTokenFromPlaceholder(shared, '')).toEqual({ options: {} });
  });

  test('returns credential-free configs by reference', () => {
    const conf = { name: 'conf1', datasets: [{ files: [{ url: 'https://a/x.zarr' }] }] };

    expect(replaceTokenWithPlaceholder(conf, 'abc')).toBe(conf);
    expect(restoreTokenFromPlaceholder(conf, 'abc')).toBe(conf);
    expect(restoreTokenFromPlaceholder(conf, '')).toBe(conf);
  });

  test('is a no-op when the sharer has no token', () => {
    const conf = confWithToken('abc');
    const shared = replaceTokenWithPlaceholder(conf, '');

    expect(shared).toBe(conf);
    expect(JSON.stringify(shared)).not.toContain(SHARED_TOKEN_PLACEHOLDER);
  });

  test('is idempotent, so a recipient can re-share', () => {
    const shared = replaceTokenWithPlaceholder(confWithToken('abc'), 'abc');
    const reshared = replaceTokenWithPlaceholder(restoreTokenFromPlaceholder(shared, 'xyz'), 'xyz');

    expect(reshared).toEqual(shared);
  });

  test('handles null and undefined', () => {
    expect(replaceTokenWithPlaceholder(null, 'abc')).toBeNull();
    expect(replaceTokenWithPlaceholder(undefined, 'abc')).toBeUndefined();
    expect(restoreTokenFromPlaceholder(null, 'abc')).toBeNull();
  });
});

describe('containsCredentials', () => {
  test('detects both credential shapes', () => {
    expect(containsCredentials({ url: 'https://a/x?token=abc' })).toBe(true);
    expect(containsCredentials({ requestInit: { headers: { Authorization: 'Bearer abc' } } })).toBe(true);
  });

  test('is false for a config with no credentials', () => {
    expect(containsCredentials({ url: 'https://a/x.zarr', requestInit: {} })).toBe(false);
    expect(containsCredentials(null)).toBe(false);
    expect(containsCredentials(undefined)).toBe(false);
  });
});

describe('sharedConfNeedsCredentials', () => {
  const encodeFragment = (conf: object) => {
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(conf));
    return `#vitessce_conf_length=${compressed.length}&vitessce_conf_version=0.0.1&vitessce_conf=${compressed}`;
  };

  test('detects a shared config that references non-public data', () => {
    const hash = encodeFragment({ url: `https://a/x?token=${SHARED_TOKEN_PLACEHOLDER}` });

    expect(sharedConfNeedsCredentials(hash)).toBe(true);
    // The leading `#` is optional, since callers pass either location.hash or a bare fragment.
    expect(sharedConfNeedsCredentials(hash.slice(1))).toBe(true);
  });

  test('is false for a shared config that carries no credentials', () => {
    expect(sharedConfNeedsCredentials(encodeFragment({ url: 'https://a/x.zarr' }))).toBe(false);
  });

  test('is false for hashes that are not shared configs', () => {
    expect(sharedConfNeedsCredentials('')).toBe(false);
    expect(sharedConfNeedsCredentials('#attribution')).toBe(false);
    expect(sharedConfNeedsCredentials('#summary')).toBe(false);
  });

  test('is false rather than throwing on a malformed fragment', () => {
    expect(sharedConfNeedsCredentials('#vitessce_conf_length=3&vitessce_conf=%%%not-lz%%%')).toBe(false);
    expect(sharedConfNeedsCredentials('#vitessce_conf_length=0')).toBe(false);
  });
});
