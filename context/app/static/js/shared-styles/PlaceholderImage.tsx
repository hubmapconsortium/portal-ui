import React from 'react';

interface PlaceholderImageProps extends React.HTMLAttributes<HTMLImageElement> {
  title: string;
  width?: number;
  height?: number;
  alt: string;
}

// PlaceholderImage renders an image from picsum.photos, for use during development when images are not yet finalized
// An image is consistently selected based on the title prop

function PlaceholderImage({ title, width = 390, height = 520, alt = 'Test', ...rest }: PlaceholderImageProps) {
  const titleSeed = title.length + title.charCodeAt(0);
  return <img src={`https://picsum.photos/id/${titleSeed}/${width}/${height}`} {...rest} alt={alt} />;
}

export default PlaceholderImage;
