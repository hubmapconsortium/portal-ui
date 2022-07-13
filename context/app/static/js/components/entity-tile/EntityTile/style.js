import styled, { css } from 'styled-components';
import SvgIcon from '@material-ui/core/SvgIcon';

const StyledIcon = styled(SvgIcon)`
  font-size: 1.3rem;
  height: 25px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;
const tileWidth = '310px';

const thumbnailDimension = '80px';

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: ${thumbnailDimension};
  box-sizing: content-box;
`;

const LetterboxedThumbnail = styled.img`
  width: ${thumbnailDimension};
  height: ${thumbnailDimension};
  min-width: ${thumbnailDimension}; // immediately takes up 90px when there is text overflow
  object-fit: contain;
  background-color: black;

  ${(props) =>
    !props.$shouldDisplayImage &&
    css`
      display: none;
    `}
`;

export { StyledIcon, Flex, LetterboxedThumbnail, tileWidth };
