import styled from 'styled-components';
import Container from '@material-ui/core/Container';
/* eslint-disable import/no-unresolved */
import HPersonLogo from 'images/hubmap-person.svg';
import HTextLogo from 'images/hubmap-logo.svg';
/* eslint-enable import/no-unresolved */

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: ${(props) => props.theme.spacing(1)}px;
`;

const PersonLogo = styled(HPersonLogo)`
  height: 100px;
`;

const TextLogo = styled(HTextLogo)`
  height: 30px;
  fill: black;
`;

const Background = styled.div`
  background-color: ${(props) => props.theme.palette.transparentGray.main};
  padding: ${(props) => props.theme.spacing(2, 1)};
`;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
`;

const StyledImage = styled.img`
  height: 100px;
  width: 100px;
  align-self: center;
  padding-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { Background, StyledImage, PersonLogo, TextLogo, Flex, StyledContainer };
