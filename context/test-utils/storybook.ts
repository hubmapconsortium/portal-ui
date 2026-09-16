import { composeStories, setProjectAnnotations } from '@storybook/react-vite';

import { decorators, mockEndpoints } from '../.storybook/preview';

// Gives `composeStories` the same `Providers` wrapper a story gets in Storybook, so a spec can
// reuse a story as its fixture. Only the decorators are registered: the preview's msw loader
// starts a browser service worker, and specs mock with `setupServer` from `msw/node` instead.
//
// This lives here rather than in setupTests.ts so that only the specs that actually compose a
// story pay for loading the preview; registering it globally added ~11s to a full run.
setProjectAnnotations({ decorators });

// Re-exported so a spec can build msw handler URLs from the same endpoints the composed
// stories see, without reaching up into `.storybook/` itself.
export { composeStories, mockEndpoints };
