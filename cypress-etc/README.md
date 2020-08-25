There isn't a good mechanism in npm to distinguish test-only dependencies from those necessary for the build.
- Cypress is pretty big, so to speed up the build, Cypress and its tests will be in this separate directory.
- Artillery is not large, but it also is not needed for the build, so it's here, too.