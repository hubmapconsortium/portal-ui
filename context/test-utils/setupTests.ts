import '@testing-library/jest-dom/vitest';
import 'intersection-observer'; // polyfill intersection observer (jsdom doesn't ship one)

// Polyfill TextEncoder and TextDecoder, which are no longer provided by jsdom
import { TextEncoder, TextDecoder } from 'node:util';
// MSW 2.14+ (SSE support) reads WritableStream / ReadableStream / TransformStream
// at module load. jsdom doesn't expose these; Node provides them via stream/web.
import { WritableStream, ReadableStream, TransformStream } from 'node:stream/web';

Object.assign(globalThis, {
  TextDecoder,
  TextEncoder,
  WritableStream,
  ReadableStream,
  TransformStream,
});

// Mock ResizeObserver for React Flow.
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
