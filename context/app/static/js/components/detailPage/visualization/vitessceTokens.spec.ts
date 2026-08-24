import {
  SHARED_TOKEN_PLACEHOLDER,
  containsCredentials,
  replaceTokenWithPlaceholder,
  restoreTokenFromPlaceholder,
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

    expect(restoreTokenFromPlaceholder(shared, 'xyz')).toEqual({
      conf: confWithToken('xyz'),
      strippedCredentials: false,
    });
  });

  test('strips credentials entirely for a viewer with no token', () => {
    const shared = replaceTokenWithPlaceholder(confWithToken('abc'), 'abc');
    const { conf, strippedCredentials } = restoreTokenFromPlaceholder(shared, '');

    expect(strippedCredentials).toBe(true);
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
    const { conf } = restoreTokenFromPlaceholder(shared, '');

    expect(conf).toEqual({ requestInit: { headers: { 'Content-Type': 'application/json' } } });
  });

  test('leaves a well-formed URL whatever position the token param is in', () => {
    const shared = {
      only: `https://a/x?${`token=${SHARED_TOKEN_PLACEHOLDER}`}`,
      first: `https://a/x?token=${SHARED_TOKEN_PLACEHOLDER}&z=1`,
      last: `https://a/x?z=1&token=${SHARED_TOKEN_PLACEHOLDER}`,
    };

    expect(restoreTokenFromPlaceholder(shared, '').conf).toEqual({
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
    const { conf } = restoreTokenFromPlaceholder(shared, '');

    // The emptied element stays at its index rather than being filtered out.
    expect(conf).toEqual({ datasets: [{ name: 'conf1' }, {}] });
  });

  test('keeps objects that were already empty', () => {
    const shared = {
      options: {},
      requestInit: { headers: { Authorization: `Bearer ${SHARED_TOKEN_PLACEHOLDER}` } },
    };
    const { conf } = restoreTokenFromPlaceholder(shared, '');

    expect(conf).toEqual({ options: {} });
  });

  test('returns credential-free configs by reference', () => {
    const conf = { name: 'conf1', datasets: [{ files: [{ url: 'https://a/x.zarr' }] }] };

    expect(replaceTokenWithPlaceholder(conf, 'abc')).toBe(conf);
    expect(restoreTokenFromPlaceholder(conf, 'abc').conf).toBe(conf);
    expect(restoreTokenFromPlaceholder(conf, '')).toEqual({ conf, strippedCredentials: false });
  });

  test('is a no-op when the sharer has no token', () => {
    const conf = confWithToken('abc');
    const shared = replaceTokenWithPlaceholder(conf, '');

    expect(shared).toBe(conf);
    expect(JSON.stringify(shared)).not.toContain(SHARED_TOKEN_PLACEHOLDER);
  });

  test('is idempotent, so a recipient can re-share', () => {
    const shared = replaceTokenWithPlaceholder(confWithToken('abc'), 'abc');
    const reshared = replaceTokenWithPlaceholder(restoreTokenFromPlaceholder(shared, 'xyz').conf, 'xyz');

    expect(reshared).toEqual(shared);
  });

  test('handles null and undefined', () => {
    expect(replaceTokenWithPlaceholder(null, 'abc')).toBeNull();
    expect(replaceTokenWithPlaceholder(undefined, 'abc')).toBeUndefined();
    expect(restoreTokenFromPlaceholder(null, 'abc')).toEqual({ conf: null, strippedCredentials: false });
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
