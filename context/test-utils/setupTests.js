import '@testing-library/jest-dom';
import 'whatwg-fetch'; // polyfill fetch
import 'intersection-observer'; // polyfill intersection observer

// Polyfill TextEncoder and TextDecoder, which are no longer provided by jsdom
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

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
