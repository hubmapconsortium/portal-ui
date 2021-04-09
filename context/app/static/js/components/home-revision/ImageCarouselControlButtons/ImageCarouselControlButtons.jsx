import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftRoundedIcon from '@material-ui/icons/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import PanoramaFishEyeRoundedIcon from '@material-ui/icons/PanoramaFishEyeRounded';
import Brightness1RoundedIcon from '@material-ui/icons/Brightness1Rounded';
import { FlexList, StyledIconButton } from './style';

function SelectImageButton({ isSelectedImageIndex, onClick }) {
  return (
    <StyledIconButton tabIndex="-1" onClick={onClick} disabled={isSelectedImageIndex}>
      {isSelectedImageIndex ? <Brightness1RoundedIcon /> : <PanoramaFishEyeRoundedIcon />}
    </StyledIconButton>
  );
}

function ImageCarouselControlButtons({ numImages, selectedImageIndex, setSelectedImageIndex }) {
  function setNextSelectedImageIndex() {
    setSelectedImageIndex(selectedImageIndex === numImages - 1 ? 0 : selectedImageIndex + 1);
  }

  function setPreviousSelectedImageIndex() {
    setSelectedImageIndex(selectedImageIndex === 0 ? numImages - 1 : selectedImageIndex - 1);
  }

  return (
    <FlexList aria-hidden="true">
      <li>
        <IconButton tabIndex="-1" color="primary" onClick={setPreviousSelectedImageIndex}>
          <ChevronLeftRoundedIcon />
        </IconButton>
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
        <IconButton tabIndex="-1" color="primary" onClick={setNextSelectedImageIndex}>
          <ChevronRightRoundedIcon />
        </IconButton>
      </li>
    </FlexList>
  );
}

export default ImageCarouselControlButtons;
