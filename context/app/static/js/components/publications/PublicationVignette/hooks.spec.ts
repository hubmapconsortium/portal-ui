import { renderHook, appProviderEndpoints, appProviderToken } from 'test-utils/functions';
import useSWR from 'swr';

import { usePublicationVignetteConfs } from './hooks';

// The hook fetches the vignette's template configs via SWR; mock only the default export (keep
// SWRConfig etc., which the render wrapper's Providers use) so the template is deterministic.
vi.mock('swr', async (importOriginal) => ({
  ...(await importOriginal<typeof import('swr')>()),
  default: vi.fn(),
}));
const mockedUseSWR = vi.mocked(useSWR);

const uuid = 'publication-uuid';

// One non-zarr file (gets a `?token=` query param) and one zarr file (gets a `requestInit` header),
// which is how `fillUrls` splits the two credential shapes.
const templateConf = {
  datasets: [
    {
      files: [
        { fileType: 'raster.json', url: '{{ base_url }}/image.ome.tif' },
        { fileType: 'anndata.zarr', url: '{{ base_url }}/matrix.zarr' },
      ],
    },
  ],
};

const vignette = {
  name: 'v',
  description: 'd',
  directory_name: 'vignette_01',
  figures: [{ file: 'f.json', name: 'f' }],
};

interface FileDef {
  url: string;
  requestInit?: { headers?: { Authorization?: string } };
}

function renderConfs(mapped_data_access_level?: string) {
  const flaskData = {
    endpoints: {},
    entity: { uuid, hubmap_id: 'HBM123.ABC', entity_type: 'Publication', mapped_data_access_level },
  } as unknown as FlaskData;

  const { result } = renderHook(
    () => usePublicationVignetteConfs({ uuid, vignette, vignetteDirName: vignette.directory_name }),
    { flaskData },
  );
  const files = (result.current as unknown as { datasets: { files: FileDef[] }[] }[])[0].datasets[0].files;
  return { nonZarr: files[0], zarr: files[1] };
}

describe('usePublicationVignetteConfs', () => {
  beforeEach(() => {
    mockedUseSWR.mockImplementation(
      (key) => ({ data: key ? [structuredClone(templateConf)] : undefined }) as ReturnType<typeof useSWR>,
    );
  });

  test('omits credentials for a Public publication', () => {
    const { nonZarr, zarr } = renderConfs('Public');

    expect(nonZarr.url).toBe(`${appProviderEndpoints.assetsEndpoint}/${uuid}/data/image.ome.tif`);
    expect(nonZarr.url).not.toContain('token=');
    expect(zarr.requestInit).toEqual({});
  });

  test('keeps credentials for a Consortium publication', () => {
    const { nonZarr, zarr } = renderConfs('Consortium');

    expect(nonZarr.url).toContain(`?token=${appProviderToken}`);
    expect(zarr.requestInit).toEqual({ headers: { Authorization: `Bearer ${appProviderToken}` } });
  });

  // Failing safe: without a positive `Public` we cannot confirm the assets are readable
  // unauthenticated, so the previous behavior is preserved.
  test('keeps credentials when the access level is unknown', () => {
    const { nonZarr, zarr } = renderConfs(undefined);

    expect(nonZarr.url).toContain(`?token=${appProviderToken}`);
    expect(zarr.requestInit).toEqual({ headers: { Authorization: `Bearer ${appProviderToken}` } });
  });

  test('substitutes the base_url template regardless of access level', () => {
    ['Public', 'Consortium'].forEach((level) => {
      const { nonZarr, zarr } = renderConfs(level);
      expect(nonZarr.url).not.toContain('{{ base_url }}');
      expect(zarr.url).toBe(`${appProviderEndpoints.assetsEndpoint}/${uuid}/data/matrix.zarr`);
    });
  });
});
