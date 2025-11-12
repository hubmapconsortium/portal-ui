import { renderHook, act } from '@testing-library/react';
import useFilesStore from './useFilesStore';

describe('useFilesStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useFilesStore.setState({
      filesToDisplay: 'all',
      selectedFileFilters: [],
    });
  });

  describe('toggleFileFilter', () => {
    it('should add filter when not selected', () => {
      const { result } = renderHook(() => useFilesStore());

      act(() => {
        result.current.toggleFileFilter('qa/qc');
      });

      expect(result.current.selectedFileFilters).toEqual(['qa/qc']);
      expect(result.current.filesToDisplay).toBe('qa/qc');
    });

    it('should remove filter when already selected', () => {
      const { result } = renderHook(() => useFilesStore());

      // First add the filter
      act(() => {
        result.current.toggleFileFilter('qa/qc');
      });

      expect(result.current.selectedFileFilters).toEqual(['qa/qc']);

      // Then remove it
      act(() => {
        result.current.toggleFileFilter('qa/qc');
      });

      expect(result.current.selectedFileFilters).toEqual([]);
      expect(result.current.filesToDisplay).toBe('all');
    });

    it('should allow multiple filters to be selected', () => {
      const { result } = renderHook(() => useFilesStore());

      act(() => {
        result.current.toggleFileFilter('qa/qc');
      });

      expect(result.current.selectedFileFilters).toEqual(['qa/qc']);

      act(() => {
        result.current.toggleFileFilter('data products');
      });

      expect(result.current.selectedFileFilters).toEqual(['qa/qc', 'data products']);
      expect(result.current.filesToDisplay).toBe('both');
    });

    it('should toggle individual filters independently', () => {
      const { result } = renderHook(() => useFilesStore());

      // Add both filters
      act(() => {
        result.current.toggleFileFilter('qa/qc');
        result.current.toggleFileFilter('data products');
      });

      expect(result.current.selectedFileFilters).toEqual(['qa/qc', 'data products']);

      // Remove one filter
      act(() => {
        result.current.toggleFileFilter('qa/qc');
      });

      expect(result.current.selectedFileFilters).toEqual(['data products']);
      expect(result.current.filesToDisplay).toBe('data products');
    });
  });

  describe('backward compatibility methods', () => {
    it('should work with toggleDisplayOnlyQaQc', () => {
      const { result } = renderHook(() => useFilesStore());

      act(() => {
        result.current.toggleDisplayOnlyQaQc();
      });

      expect(result.current.filesToDisplay).toBe('qa/qc');
      expect(result.current.selectedFileFilters).toEqual(['qa/qc']);

      act(() => {
        result.current.toggleDisplayOnlyQaQc();
      });

      expect(result.current.filesToDisplay).toBe('all');
      expect(result.current.selectedFileFilters).toEqual([]);
    });

    it('should work with toggleDisplayOnlyDataProducts', () => {
      const { result } = renderHook(() => useFilesStore());

      act(() => {
        result.current.toggleDisplayOnlyDataProducts();
      });

      expect(result.current.filesToDisplay).toBe('data products');
      expect(result.current.selectedFileFilters).toEqual(['data products']);

      act(() => {
        result.current.toggleDisplayOnlyDataProducts();
      });

      expect(result.current.filesToDisplay).toBe('all');
      expect(result.current.selectedFileFilters).toEqual([]);
    });
  });
});
