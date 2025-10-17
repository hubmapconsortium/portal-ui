import { Tutorial } from './types';

export function tutorialIsReady(tutorial: Tutorial): boolean {
  return !!tutorial.iframeLink;
}
