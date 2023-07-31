import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  flex-direction: column-reverse;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-direction: row;
    & > .slider-container {
      max-width: 66%;
      & > .slider-frame > .slider-list > .slide > img {
        width: 100%;
      }
    }
  }
`;

const callToActionMdOrLargerWidth = 400;

const CallToActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    box-sizing: border-box;
    min-width: 25%;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

export { Flex, CallToActionWrapper, callToActionMdOrLargerWidth };
