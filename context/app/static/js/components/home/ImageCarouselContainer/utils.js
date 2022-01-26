function getCarouselImageSrcSet(key, path) {
  return ['320', '640', '1280', '1392'].reduce((acc, width) => {
    return { ...acc, [`src${width}w`]: `${path}/${key}-slide-${width}w.png` };
  }, {});
}

export { getCarouselImageSrcSet };
