import { getCarouselImageSrcSet } from './utils';

test('should return correct srcset', () => {
  expect(getCarouselImageSrcSet('cat', 'http://example.com/animals', 'png')).toEqual(
    [
      'http://example.com/animals/cat-slide-320w.png 320w',
      'http://example.com/animals/cat-slide-640w.png 640w',
      'http://example.com/animals/cat-slide-1280w.png 1280w',
      'http://example.com/animals/cat-slide-1392w.png 1392w',
    ].join(', '),
  );
  expect(getCarouselImageSrcSet('cat', 'http://example.com/animals', 'webp')).toEqual(
    [
      'http://example.com/animals/cat-slide-320w.webp',
      'http://example.com/animals/cat-slide-640w.webp',
      'http://example.com/animals/cat-slide-1280w.webp',
      'http://example.com/animals/cat-slide-1392w.webp',
    ].join(', '),
  );
});
