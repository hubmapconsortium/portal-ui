const imageSizes = [25, 50, 75, 100] as const;
const widths = [320, 640, 960, 1280] as const;

export function getCarouselImageSrcSet(key: string, url: string, fileType: string) {
  return imageSizes
    .map((width, idx) => {
      return `${url}/${key}-${width}.${fileType} ${widths[idx]}w`;
    })
    .join(', ');
}

export const constructSrcSet = (key: string, fileType: string) => getCarouselImageSrcSet(key, CDN_URL, fileType);
