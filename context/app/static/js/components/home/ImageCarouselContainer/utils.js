function getCarouselImageSrcSet(key, url) {
  return ['320', '640', '1280', '1392'].reduce((acc, width) => {
    return { ...acc, [`src${width}w`]: `${url}/${key}-slide-${width}w.png` };
  }, {});
}

export { getCarouselImageSrcSet };
