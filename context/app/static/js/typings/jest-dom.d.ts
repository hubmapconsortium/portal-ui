import '@testing-library/jest-dom';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

// Vitest 5 widened `Assertion` from `Assertion<T>` to `Assertion<R, T>`. Declaration
// merging requires identical type parameter lists, so jest-dom's own `Assertion<T>`
// augmentation (still single-parameter as of 7.0.1) no longer merges and its matchers
// vanish from the types, while continuing to work at runtime. `Matchers` is Vitest's
// supported extension point and `Assertion` extends it, so redeclaring the matchers
// here puts them back. Drop this once jest-dom ships Vitest 5 types.
//
// The parameter list has to be copied from Vitest verbatim for the merge to happen,
// which leaves `T` unused, and the body is empty because everything comes from the
// supertype -- hence the two disables.
declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> extends TestingLibraryMatchers<
    unknown,
    R
  > {}
}
