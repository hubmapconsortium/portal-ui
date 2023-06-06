import React, { useCallback } from 'react';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import PanoramaFishEyeRoundedIcon from '@material-ui/icons/PanoramaFishEyeRounded';
import Brightness1RoundedIcon from '@material-ui/icons/Brightness1Rounded';
import { FlexList, StyledIconButton } from './style';

function SelectImageButton({ isSelectedImageIndex, onClick }) {
  return (
    <StyledIconButton tabIndex="-1" onClick={onClick} disabled={isSelectedImageIndex}>
      {isSelectedImageIndex ? (
        <Brightness1RoundedIcon fontSize="small" />
      ) : (
        <PanoramaFishEyeRoundedIcon fontSize="small" />
      )}
    </StyledIconButton>
  );
}

function ImageCarouselControlButtons({ numImages, selectedImageIndex, setSelectedImageIndex }) {
  const setNextSelectedImageIndex = useCallback(
    function setNextSelectedImageIndex() {
      setSelectedImageIndex((selectedImageIndex + 1) % numImages);
    },
    [numImages, selectedImageIndex, setSelectedImageIndex],
  );

  const setPreviousSelectedImageIndex = useCallback(
    function setPreviousSelectedImageIndex() {
      setSelectedImageIndex((selectedImageIndex - 1 + numImages) % numImages); // In JS, "%" is remainder, not modulus.
    },
    [numImages, selectedImageIndex, setSelectedImageIndex],
  );

  return (
    <FlexList aria-hidden="true">
      <li>
        <StyledIconButton tabIndex="-1" color="primary" onClick={setPreviousSelectedImageIndex}>
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
        <StyledIconButton tabIndex="-1" color="primary" onClick={setNextSelectedImageIndex}>
          <ChevronRightRoundedIcon />
        </StyledIconButton>
      </li>
    </FlexList>
  );
}

export default ImageCarouselControlButtons;
