import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  flex-direction: column-reverse;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-direction: row;
  }
`;

const callToActionMdOrLargerWidth = 400;

const CallToActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    box-sizing: border-box;
    width: ${(props) => callToActionMdOrLargerWidth - props.theme.spacing(1)};
    flex-shrink: 0;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

export { Flex, CallToActionWrapper, callToActionMdOrLargerWidth };
