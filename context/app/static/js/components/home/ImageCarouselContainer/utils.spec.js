import { getCarouselImageSrcSet } from './utils';

test('should return correct srcset', () => {
  expect(getCarouselImageSrcSet('cat', 'http://example.com/animals')).toEqual({
    src320w: 'http://example.com/animals/cat-slide-320w.png',
    src640w: 'http://example.com/animals/cat-slide-640w.png',
    src1280w: 'http://example.com/animals/cat-slide-1280w.png',
    src1392w: 'http://example.com/animals/cat-slide-1392w.png',
  });
});
