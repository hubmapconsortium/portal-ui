import '@testing-library/jest-dom';
import 'whatwg-fetch'; // polyfill fetch
import 'intersection-observer'; // polyfill intersection observer

// Polyfill TextEncoder and TextDecoder, which are no longer provided by jsdom
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });
