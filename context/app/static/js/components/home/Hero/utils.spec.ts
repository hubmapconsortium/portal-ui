import { getCarouselImageSrcSet } from './utils';

test('should return correct srcset', () => {
  expect(getCarouselImageSrcSet('cat', 'http://example.com/animals', 'png')).toEqual(
    [
      'http://example.com/animals/cat-25.png 320w',
      'http://example.com/animals/cat-50.png 640w',
      'http://example.com/animals/cat-75.png 960w',
      'http://example.com/animals/cat-100.png 1280w',
    ].join(', '),
  );
  expect(getCarouselImageSrcSet('cat', 'http://example.com/animals', 'webp')).toEqual(
    [
      'http://example.com/animals/cat-25.webp 320w',
      'http://example.com/animals/cat-50.webp 640w',
      'http://example.com/animals/cat-75.webp 960w',
      'http://example.com/animals/cat-100.webp 1280w',
    ].join(', '),
  );
});
