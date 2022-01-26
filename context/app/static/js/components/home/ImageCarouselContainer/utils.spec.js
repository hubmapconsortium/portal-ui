import { getCarouselImageSrcSet } from './utils';

test('should return correct srcset', () => {
  expect(getCarouselImageSrcSet('cat', 'images/animals')).toEqual({
    src320w: 'images/animals/cat-slide-320w.png',
    src640w: 'images/animals/cat-slide-640w.png',
    src1280w: 'images/animals/cat-slide-1280w.png',
    src1392w: 'images/animals/cat-slide-1392w.png',
  });
});
