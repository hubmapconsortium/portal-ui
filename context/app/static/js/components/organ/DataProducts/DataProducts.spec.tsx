import React from 'react';
import { render, screen, within } from 'test-utils/functions';
import userEvent from '@testing-library/user-event';

import { OrganDataProducts, OrganFile } from 'js/components/organ/types';
import { sortProducts, sumCellCounts, DataProductsTable } from './DataProducts';

function makeProduct(
  overrides: Partial<OrganDataProducts> & Pick<OrganDataProducts, 'tissue' | 'assay' | 'creation_time'>,
): OrganDataProducts {
  return {
    data_product_id: `dp-${overrides.tissue.tissuetype}-${overrides.assay.assayName}`,
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

const kidneyRnaSeq = makeProduct({
  tissue: { tissuetype: 'Kidney (Left)', tissuecode: 'LK', uberoncode: 'U1' },
  assay: { assayName: 'rna-seq' },
  creation_time: '2025-09-02T00:00:00',
  download_raw: 'https://example.com/LK_raw.h5ad',
  download: 'https://example.com/LK_processed.h5ad',
  raw_file_size_bytes: 1_000_000,
  processed_file_sizes_bytes: 2_000_000,
  raw_cell_type_counts: { 'T cell': 100, 'B cell': 200 },
  processed_cell_type_counts: { 'T cell': 50, 'B cell': 150, Macrophage: 75 },
  datasetUUIDs: ['uuid-1', 'uuid-2'],
});

const heartAtac = makeProduct({
  tissue: { tissuetype: 'Heart', tissuecode: 'HT', uberoncode: 'U2' },
  assay: { assayName: 'atac' },
  creation_time: '2025-12-16T00:00:00',
  download_raw: 'https://example.com/HT.h5mu',
  raw_file_size_bytes: 8_630_000_000,
  raw_cell_type_counts: {},
  datasetUUIDs: ['uuid-3'],
});

const bladderRnaSeq = makeProduct({
  tissue: { tissuetype: 'Bladder', tissuecode: 'BL', uberoncode: 'U3' },
  assay: { assayName: 'rna-seq' },
  creation_time: '2025-09-02T00:00:00',
  download_raw: 'https://example.com/BL_raw.h5ad',
  download: 'https://example.com/BL_processed.h5ad',
  raw_file_size_bytes: 500_000,
  processed_file_sizes_bytes: 600_000,
  raw_cell_type_counts: { Epithelial: 1000 },
  processed_cell_type_counts: { Epithelial: 900 },
  datasetUUIDs: ['uuid-4'],
});

describe('sumCellCounts', () => {
  test('returns 0 for undefined', () => {
    expect(sumCellCounts(undefined)).toBe(0);
  });

  test('returns 0 for empty object', () => {
    expect(sumCellCounts({})).toBe(0);
  });

  test('sums all values', () => {
    expect(sumCellCounts({ 'T cell': 100, 'B cell': 200, Macrophage: 75 })).toBe(375);
  });
});

describe('sortProducts', () => {
  const products = [kidneyRnaSeq, heartAtac, bladderRnaSeq];

  test('sorts by tissue ascending', () => {
    const sorted = sortProducts(products, 'tissue', 'asc');
    expect(sorted.map((p) => p.tissue.tissuetype)).toEqual(['Bladder', 'Heart', 'Kidney (Left)']);
  });

  test('sorts by tissue descending', () => {
    const sorted = sortProducts(products, 'tissue', 'desc');
    expect(sorted.map((p) => p.tissue.tissuetype)).toEqual(['Kidney (Left)', 'Heart', 'Bladder']);
  });

  test('sorts by assay ascending', () => {
    const sorted = sortProducts(products, 'assay', 'asc');
    expect(sorted.map((p) => p.assay.assayName)).toEqual(['atac', 'rna-seq', 'rna-seq']);
  });

  test('sorts by creation_time descending', () => {
    const sorted = sortProducts(products, 'creation_time', 'desc');
    // Heart has the latest date; Kidney and Bladder share the same date so their relative order is stable but unspecified
    expect(sorted[0].tissue.tissuetype).toBe('Heart');
    expect(new Set(sorted.slice(1).map((p) => p.tissue.tissuetype))).toEqual(new Set(['Bladder', 'Kidney (Left)']));
  });
});

describe('DataProductsTable', () => {
  const products = [kidneyRnaSeq, heartAtac];

  test('renders table with organ and assay columns', () => {
    render(<DataProductsTable dataProducts={products} />);
    expect(screen.getByText('Kidney (Left)')).toBeInTheDocument();
    expect(screen.getByText('Heart')).toBeInTheDocument();
    expect(screen.getByText('rna-seq')).toBeInTheDocument();
    expect(screen.getByText('atac')).toBeInTheDocument();
  });

  test('renders download file names', () => {
    render(<DataProductsTable dataProducts={products} />);
    expect(screen.getByText('LK_raw.h5ad')).toBeInTheDocument();
    expect(screen.getByText('LK_processed.h5ad')).toBeInTheDocument();
    expect(screen.getByText('HT.h5mu')).toBeInTheDocument();
  });

  test('renders cell counts with types when available', () => {
    render(<DataProductsTable dataProducts={products} />);
    expect(screen.getByText('300 cells, 2 types')).toBeInTheDocument();
    expect(screen.getByText('275 cells, 3 types')).toBeInTheDocument();
  });

  test('does not render processed placeholders when no processed download exists', () => {
    render(<DataProductsTable dataProducts={[heartAtac]} />);
    const rows = screen.getAllByRole('row');
    // Header row + 1 data row
    expect(rows).toHaveLength(2);
    const dataRow = rows[1];
    // Raw side: has file size (8.63 GB) but no cell counts → 1 dash placeholder
    const captions = within(dataRow).queryAllByText('—');
    expect(captions).toHaveLength(1);
    // File size should appear for raw
    expect(within(dataRow).getByText('8.63 GB')).toBeInTheDocument();
  });

  test('renders creation dates', () => {
    render(<DataProductsTable dataProducts={products} />);
    expect(screen.getByText('2025-09-02')).toBeInTheDocument();
    expect(screen.getByText('2025-12-16')).toBeInTheDocument();
  });

  describe('standalone mode', () => {
    const organs: Record<string, OrganFile> = {
      kidney: {
        name: 'Kidney',
        search: ['Kidney (Left)', 'Kidney (Right)'],
        icon: 'https://cdn.example.com/kidney.svg',
        asctb: '',
        description: '',
        has_iu_component: false,
        uberon: '',
        uberon_short: '',
      },
      'urinary-bladder': {
        name: 'Urinary Bladder',
        search: ['Bladder'],
        icon: 'https://cdn.example.com/bladder.svg',
        asctb: '',
        description: '',
        has_iu_component: false,
        uberon: '',
        uberon_short: '',
      },
    };

    test('renders organ names as links to organ pages', () => {
      render(<DataProductsTable dataProducts={[kidneyRnaSeq]} standalone organs={organs} />);
      const link = screen.getByRole('link', { name: 'Kidney (Left)' });
      expect(link).toHaveAttribute('href', '/organs/kidney');
    });

    test('resolves organ aliases via search terms', () => {
      render(<DataProductsTable dataProducts={[bladderRnaSeq]} standalone organs={organs} />);
      const link = screen.getByRole('link', { name: 'Bladder' });
      expect(link).toHaveAttribute('href', '/organs/urinary-bladder');
    });

    test('renders organ icons when available', () => {
      render(<DataProductsTable dataProducts={[kidneyRnaSeq]} standalone organs={organs} />);
      expect(screen.getByRole('img', { name: 'Icon for Kidney (Left)' })).toBeInTheDocument();
    });
  });

  describe('sorting interaction', () => {
    test('clicking column header toggles sort direction', async () => {
      const user = userEvent.setup();
      render(<DataProductsTable dataProducts={products} />);

      // Default sort is tissue asc, so Heart comes before Kidney
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('Heart')).toBeInTheDocument();
      expect(within(rows[2]).getByText('Kidney (Left)')).toBeInTheDocument();

      // Click Organ header to toggle to desc
      await user.click(screen.getByText('Organ'));
      const rowsAfter = screen.getAllByRole('row');
      expect(within(rowsAfter[1]).getByText('Kidney (Left)')).toBeInTheDocument();
      expect(within(rowsAfter[2]).getByText('Heart')).toBeInTheDocument();
    });
  });
});
