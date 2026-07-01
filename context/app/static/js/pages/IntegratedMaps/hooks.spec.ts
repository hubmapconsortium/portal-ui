import { OrganDataProducts } from 'js/components/organ/types';
import { keepLatestVersions } from './hooks';

function makeProduct(
  overrides: Partial<OrganDataProducts> & Pick<OrganDataProducts, 'tissue' | 'assay' | 'creation_time'>,
): OrganDataProducts {
  return {
    data_product_id: `dp-${overrides.tissue.tissuetype}-${overrides.assay.assayName}-${overrides.creation_time}`,
    dataSets: [],
    shiny_app: '',
    download: '',
    download_raw: '',
    raw_file_size_bytes: 0,
    processed_file_sizes_bytes: 0,
    raw_cell_type_counts: {},
    processed_cell_type_counts: {},
    ...overrides,
  };
}

describe('keepLatestVersions', () => {
  test('returns empty array for empty input', () => {
    expect(keepLatestVersions([])).toEqual([]);
  });

  test('keeps only the latest version per organ/assay combination', () => {
    const older = makeProduct({
      tissue: { tissuetype: 'Kidney (Left)', tissuecode: 'LK', uberoncode: 'U1' },
      assay: { assayName: 'rna-seq' },
      creation_time: '2025-01-01T00:00:00',
    });
    const newer = makeProduct({
      tissue: { tissuetype: 'Kidney (Left)', tissuecode: 'LK', uberoncode: 'U1' },
      assay: { assayName: 'rna-seq' },
      creation_time: '2025-06-01T00:00:00',
    });

    const result = keepLatestVersions([older, newer]);
    expect(result).toHaveLength(1);
    expect(result[0].creation_time).toBe('2025-06-01T00:00:00');
  });

  test('keeps separate entries for different assay types on the same organ', () => {
    const rnaSeq = makeProduct({
      tissue: { tissuetype: 'Heart', tissuecode: 'HT', uberoncode: 'U2' },
      assay: { assayName: 'rna-seq' },
      creation_time: '2025-01-01T00:00:00',
    });
    const atac = makeProduct({
      tissue: { tissuetype: 'Heart', tissuecode: 'HT', uberoncode: 'U2' },
      assay: { assayName: 'atac' },
      creation_time: '2025-01-01T00:00:00',
    });

    expect(keepLatestVersions([rnaSeq, atac])).toHaveLength(2);
  });

  test('keeps separate entries for different organs with the same assay', () => {
    const kidney = makeProduct({
      tissue: { tissuetype: 'Kidney (Left)', tissuecode: 'LK', uberoncode: 'U1' },
      assay: { assayName: 'rna-seq' },
      creation_time: '2025-01-01T00:00:00',
    });
    const heart = makeProduct({
      tissue: { tissuetype: 'Heart', tissuecode: 'HT', uberoncode: 'U2' },
      assay: { assayName: 'rna-seq' },
      creation_time: '2025-01-01T00:00:00',
    });

    expect(keepLatestVersions([kidney, heart])).toHaveLength(2);
  });

  test('handles multiple groups each with multiple versions', () => {
    const products = [
      makeProduct({
        tissue: { tissuetype: 'Kidney (Left)', tissuecode: 'LK', uberoncode: 'U1' },
        assay: { assayName: 'rna-seq' },
        creation_time: '2025-01-01T00:00:00',
      }),
      makeProduct({
        tissue: { tissuetype: 'Kidney (Left)', tissuecode: 'LK', uberoncode: 'U1' },
        assay: { assayName: 'rna-seq' },
        creation_time: '2025-09-01T00:00:00',
      }),
      makeProduct({
        tissue: { tissuetype: 'Heart', tissuecode: 'HT', uberoncode: 'U2' },
        assay: { assayName: 'atac' },
        creation_time: '2025-03-01T00:00:00',
      }),
      makeProduct({
        tissue: { tissuetype: 'Heart', tissuecode: 'HT', uberoncode: 'U2' },
        assay: { assayName: 'atac' },
        creation_time: '2025-07-01T00:00:00',
      }),
    ];

    const result = keepLatestVersions(products);
    expect(result).toHaveLength(2);

    const kidneyResult = result.find((p) => p.tissue.tissuetype === 'Kidney (Left)');
    const heartResult = result.find((p) => p.tissue.tissuetype === 'Heart');
    expect(kidneyResult?.creation_time).toBe('2025-09-01T00:00:00');
    expect(heartResult?.creation_time).toBe('2025-07-01T00:00:00');
  });
});
