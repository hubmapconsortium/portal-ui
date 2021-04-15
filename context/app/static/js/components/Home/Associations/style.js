import styled from 'styled-components';
import Container from '@material-ui/core/Container';
/* eslint-disable import/no-unresolved */
import { ReactComponent as HPersonLogo } from 'portal-images/hubmap-person.svg';
import { ReactComponent as HTextLogo } from 'portal-images/hubmap-logo.svg';
/* eslint-enable import/no-unresolved */

const logoHeight = '100px';

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

const PersonLogo = styled(HPersonLogo)`
  height: ${logoHeight};
`;

const TextLogo = styled(HTextLogo)`
  height: 30px;
  fill: black;
`;

const Background = styled.div`
  grid-area: associations;
  background-color: ${(props) => props.theme.palette.transparentGray.main};
  padding: ${(props) => props.theme.spacing(2, 1)};
`;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${(props) => props.theme.breakpoints.values.lg}px) {
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

const StyledImage = styled.img`
  height: ${logoHeight};
  width: ${logoHeight};
  align-self: center;
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { Background, StyledImage, PersonLogo, TextLogo, Flex, StyledContainer };
