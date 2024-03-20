import { filterTabsToDisplay } from './filterTabsToDisplay';

describe('filterTabsToDisplay', () => {
  it('handle all tabs', () => {
    expect(
      filterTabsToDisplay({
        availableTabDetails: {
          graph: { label: 'g', 'data-testid': 'graph-test' },
          table: { label: 't', 'data-testid': 'table-test' },
          dag: { label: 'd', 'data-testid': 'dag-test' },
        },
        tabsToDisplay: {
          graph: true,
          table: true,
          dag: true,
        },
      }),
    ).toEqual({
      graph: { label: 'g', 'data-testid': 'graph-test', index: 0 },
      table: { label: 't', 'data-testid': 'table-test', index: 1 },
      dag: { label: 'd', 'data-testid': 'dag-test', index: 2 },
    });
  });

  it('handle missing tabs', () => {
    expect(
      filterTabsToDisplay({
        availableTabDetails: {
          graph: { label: 'g', 'data-testid': 'graph-test' },
          table: { label: 't', 'data-testid': 'table-test' },
          dag: { label: 'd', 'data-testid': 'dag-test' },
        },
        tabsToDisplay: {
          graph: true,
          table: false,
          dag: true,
        },
      }),
    ).toEqual({
      graph: { label: 'g', 'data-testid': 'graph-test', index: 0 },
      dag: { label: 'd', 'data-testid': 'dag-test', index: 1 },
    });
  });
});
