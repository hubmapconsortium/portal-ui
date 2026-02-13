// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef } from 'react';
import { renderHook } from 'test-utils/functions';
import { act } from '@testing-library/react';

import { useDownloadImage } from './useDownloadImage';

// Mock snackbar actions
const mockToastError = jest.fn();
jest.mock('js/shared-styles/snackbars', () => ({
  useSnackbarActions: () => ({ toastError: mockToastError }),
}));

// Mock html2canvas
const mockHtml2canvas = jest.fn();
jest.mock('html2canvas', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockHtml2canvas(...args),
}));

describe('useDownloadImage', () => {
  let mockClick: jest.Mock;
  let appendChildSpy: jest.SpyInstance;
  let removeChildSpy: jest.SpyInstance;

  beforeEach(() => {
    mockToastError.mockClear();
    mockHtml2canvas.mockClear();
    mockClick = jest.fn();

    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation((node) => {
      if (node instanceof HTMLAnchorElement) {
        node.click = mockClick;
      }
      return node;
    });
    removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
  });

  afterEach(() => {
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  test('does nothing when ref.current is null', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLElement>(null);
      return useDownloadImage(ref, 'test-chart');
    });

    act(() => {
      result.current();
    });

    expect(mockHtml2canvas).not.toHaveBeenCalled();
  });

  test('calls html2canvas with default scale of 2', async () => {
    const div = document.createElement('div');
    const mockCanvas = { toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test') };
    mockHtml2canvas.mockResolvedValue(mockCanvas);

    const { result } = renderHook(() => {
      const ref = useRef<HTMLElement>(div);
      return useDownloadImage(ref, 'test-chart');
    });

    await act(async () => {
      result.current();
      await Promise.resolve(); // Wait for the html2canvas promise to resolve
    });

    expect(mockHtml2canvas).toHaveBeenCalledWith(div, { scale: 2 });
  });

  test('calls html2canvas with custom scale', async () => {
    const div = document.createElement('div');
    const mockCanvas = { toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test') };
    mockHtml2canvas.mockResolvedValue(mockCanvas);

    const { result } = renderHook(() => {
      const ref = useRef<HTMLElement>(div);
      return useDownloadImage(ref, 'test-chart', 3);
    });

    await act(async () => {
      result.current();
      await Promise.resolve(); // Wait for the html2canvas promise to resolve
    });

    expect(mockHtml2canvas).toHaveBeenCalledWith(div, { scale: 3 });
  });

  test('downloads image with correct filename', async () => {
    const div = document.createElement('div');
    const mockCanvas = { toDataURL: jest.fn().mockReturnValue('data:image/png;base64,test') };
    mockHtml2canvas.mockResolvedValue(mockCanvas);

    const { result } = renderHook(() => {
      const ref = useRef<HTMLElement>(div);
      return useDownloadImage(ref, 'my-chart');
    });

    await act(async () => {
      result.current();
      await Promise.resolve(); // Wait for the html2canvas promise to resolve
    });

    const anchorCall = (appendChildSpy.mock.calls as [Node][]).find(([node]) => node instanceof HTMLAnchorElement);

    const appendedAnchor = anchorCall?.[0] as HTMLAnchorElement | undefined;

    expect(appendedAnchor).toBeDefined();
    expect(appendedAnchor!.download).toBe('my-chart.png');
    expect(appendedAnchor!.href).toContain('data:image/png;base64,test');
    expect(mockClick).toHaveBeenCalled();
  });

  test('shows error toast when html2canvas fails', async () => {
    const div = document.createElement('div');
    mockHtml2canvas.mockRejectedValue(new Error('canvas error'));

    const { result } = renderHook(() => {
      const ref = useRef<HTMLElement>(div);
      return useDownloadImage(ref, 'test-chart');
    });

    await act(async () => {
      result.current();
      await Promise.resolve(); // Wait for the html2canvas promise to resolve
    });

    expect(mockToastError).toHaveBeenCalledWith('Failed to download image. Please try again.');
  });
});
