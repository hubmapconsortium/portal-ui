import { type MockedFunction } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import EntityTable from './EntityTable';
import { Column } from './types';

// Mock the hooks
vi.mock('js/hooks/useScrollTable');
import useScrollTable from 'js/hooks/useScrollTable';

const mockUseScrollTable = useScrollTable as MockedFunction<typeof useScrollTable>;

interface TestEntity {
  hubmap_id: string;
  title: string;
}

describe('EntityTable Custom Sorting', () => {
  const customSortValues = {
    HBM001: 500,
    HBM002: 1200,
    HBM003: 800,
  };

  const columns: Column<TestEntity>[] = [
    {
      id: 'hubmap_id',
      label: 'HuBMAP ID',
      sort: 'hubmap_id.keyword',
      cellContent: ({ hit }: { hit: TestEntity }) => <span>{hit.hubmap_id}</span>,
    },
    {
      id: 'cell_count',
      label: 'Cell Count',
      customSortValues,
      cellContent: ({ hit }: { hit: TestEntity }) => {
        const count =
          hit.hubmap_id in customSortValues ? ((customSortValues as Record<string, number>)[hit.hubmap_id] ?? 0) : 0;
        return <span>{count || 0}</span>;
      },
    },
  ];

  beforeEach(() => {
    mockUseScrollTable.mockReturnValue({
      searchHits: [],
      allSearchIDs: [],
      isLoading: false,
      totalHitsCount: 0,
      sortState: { columnId: 'hubmap_id', direction: 'desc' },
      setSort: vi.fn(),
      fetchMoreOnBottomReached: vi.fn(),
      virtualRows: [],
      tableBodyPadding: { top: 0, bottom: 0 },
      tableContainerRef: { current: null },
      aggregationsLoading: false,
      setColumnFilter: vi.fn(),
      clearColumnFilter: vi.fn(),
      clearAllFilters: vi.fn(),
      toggleFilterValue: vi.fn(),
      getColumnValues: vi.fn(() => []),
      getColumnSelectedValues: vi.fn(() => new Set<string>()),
      toggleRowExpansion: vi.fn(),
      isRowExpanded: vi.fn(() => false),
    });
  });

  it('should render custom sortable column header correctly', () => {
    render(<EntityTable query={{ query: { match_all: {} } }} columns={columns} isSelectable={false} />);

    // Should show both column headers
    expect(screen.getByText('HuBMAP ID')).toBeInTheDocument();
    expect(screen.getByText('Cell Count')).toBeInTheDocument();

    // Both should be sortable (have TableSortLabel)
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('should create columns with custom sort values', () => {
    const column = columns.find((col) => col.id === 'cell_count');
    expect(column).toBeDefined();
    expect(column?.customSortValues).toBe(customSortValues);
    expect(column?.customSortValues?.['HBM001']).toBe(500);
    expect(column?.customSortValues?.['HBM002']).toBe(1200);
  });
});
