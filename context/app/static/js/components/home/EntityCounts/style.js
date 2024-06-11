import styled from 'styled-components';
import Container from '@mui/material/Container';
import SvgIcon from '@mui/material/SvgIcon';
import URLSvgIcon, { OrganIcon } from 'js/shared-styles/icons/URLSvgIcon';

const Background = styled.div`
  background-color: #cfd3e2;
`;

const FlexContainer = styled(Container)`
  @media (min-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    display: flex;
    flex-wrap: wrap;
  }
`;

const iconSize = '4.5rem';

const StyledSvgIcon = styled(SvgIcon)`
  font-size: ${iconSize};
`;

const StyledURLSvgIcon = styled(URLSvgIcon)`
  height: ${iconSize};
  width: ${iconSize};
`;

const StyledOrganIcon = styled(OrganIcon)`
  height: ${iconSize};
  width: ${iconSize};
`;

export { Background, FlexContainer, StyledSvgIcon, StyledOrganIcon, StyledURLSvgIcon };
