const imageSizes = [25, 50, 75, 100] as const;
const imageWidthMultiplier = 38.4; // 100 * 38.4 = 3840 (largest image width)

export function getCarouselImageSrcSet(key: string, url: string, fileType: string) {
  return imageSizes
    .map((width) => {
      return `${url}/${key}-${width}.${fileType} ${width * imageWidthMultiplier}w`;
    })
    .join(', ');
}

export const constructSrcSet = (key: string, fileType: string) => getCarouselImageSrcSet(key, CDN_URL, fileType);
