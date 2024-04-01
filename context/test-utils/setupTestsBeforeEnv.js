// MSW v2 migration-related polyfills
// https://mswjs.io/docs/migrations/1.x-to-2.x#requestresponsetextencoder-is-not-defined-jest
const { TextDecoder, TextEncoder } = require('node:util')
 
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
})
 
const { Blob, File } = require('node:buffer')
const { fetch, Headers, FormData, Request, Response } = require('undici')
 
Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  Headers: { value: Headers },
  FormData: { value: FormData },
  Request: { value: Request },
  Response: { value: Response },
})