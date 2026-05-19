import '@testing-library/jest-dom';
import 'whatwg-fetch'; // polyfill fetch
import 'intersection-observer'; // polyfill intersection observer

// Polyfill TextEncoder and TextDecoder, which are no longer provided by jsdom
import { TextEncoder, TextDecoder } from 'util';
// MSW 2.14+ (SSE support) reads WritableStream / ReadableStream / TransformStream
// at module load. jsdom doesn't expose these; Node provides them via stream/web.
import { WritableStream, ReadableStream, TransformStream } from 'stream/web';

Object.assign(global, { TextDecoder, TextEncoder, WritableStream, ReadableStream, TransformStream });

// Mock ResizeObserver for React Flow
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    // Mock implementation
  }

  unobserve() {
    // Mock implementation
  }

  disconnect() {
    // Mock implementation
  }
};
