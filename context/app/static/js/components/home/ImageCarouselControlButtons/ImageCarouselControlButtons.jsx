import React from 'react';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import PanoramaFishEyeRoundedIcon from '@mui/icons-material/PanoramaFishEyeRounded';
import Brightness1RoundedIcon from '@mui/icons-material/Brightness1Rounded';
import { FlexList, StyledIconButton } from './style';

function SelectImageButton({ isSelectedImageIndex, onClick }) {
  return (
    <StyledIconButton tabIndex={-1} onClick={onClick} disabled={isSelectedImageIndex}>
      {isSelectedImageIndex ? (
        <Brightness1RoundedIcon fontSize="small" />
      ) : (
        <PanoramaFishEyeRoundedIcon fontSize="small" />
      )}
    </StyledIconButton>
  );
}

function ImageCarouselControlButtons({ numImages, selectedImageIndex, setSelectedImageIndex }) {
  function setNextSelectedImageIndex() {
    setSelectedImageIndex((selectedImageIndex + 1) % numImages);
  }

  function setPreviousSelectedImageIndex() {
    setSelectedImageIndex((selectedImageIndex - 1 + numImages) % numImages); // In JS, "%" is remainder, not modulus.
  }

  return (
    <FlexList aria-hidden="true">
      <li>
        <StyledIconButton tabIndex={-1} color="primary" onClick={setPreviousSelectedImageIndex}>
          <ChevronLeftRoundedIcon />
        </StyledIconButton>
      </li>
      {Array(numImages)
        .fill()
        .map((e, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={`select-carousel-image-button-${i}`}>
            <SelectImageButton
              isSelectedImageIndex={selectedImageIndex === i}
              onClick={() => setSelectedImageIndex(i)}
            />
          </li>
        ))}

      <li>
        <StyledIconButton tabIndex={-1} color="primary" onClick={setNextSelectedImageIndex}>
          <ChevronRightRoundedIcon />
        </StyledIconButton>
      </li>
    </FlexList>
  );
}

export default ImageCarouselControlButtons;
