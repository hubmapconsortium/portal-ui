const imageSizes = [320, 640, 1280, 1392] as const;

function getCarouselImageSrcSet(key: string, url: string, fileType: string) {
  // return imageSizes.reduce((acc, width) => {
  //   return { ...acc, [`src${width}w`]: `${url}/${key}-slide-${width}w.${fileType}` };
  // }, {});
  return imageSizes
    .map((width) => {
      return `${url}/${key}-slide-${width}w.${fileType} ${width}w`;
    })
    .join(', ');
}

export { getCarouselImageSrcSet };
