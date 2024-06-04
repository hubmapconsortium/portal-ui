import { ComponentType, ImgHTMLAttributes } from 'react';
import { styled } from '@mui/material/styles';

interface LetterboxedThumbnailProps {
  $thumbnailDimension: number;
  $shouldDisplayImage: boolean;
}

const LetterboxedThumbnail = styled('img')<LetterboxedThumbnailProps>(
  ({ $thumbnailDimension, $shouldDisplayImage }) => ({
    width: `${$thumbnailDimension}px`,
    height: `${$thumbnailDimension}px`,
    minWidth: `${$thumbnailDimension}px`, // immediately takes up 90px when there is text overflow
    objectFit: 'contain',
    backgroundColor: 'black',
    display: !$shouldDisplayImage ? 'none' : 'block',
  }),
) as ComponentType<LetterboxedThumbnailProps & ImgHTMLAttributes<'img'>>;

export { LetterboxedThumbnail };
