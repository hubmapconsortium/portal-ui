import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const TableContainer = styled.div`
  margin-right: 70px;
  width: 80px;
`;

const StickyNav = styled.nav`
position: sticky;
top 70px;
`;

const TableTitle = styled(Typography)`
  margin-left: 7px;
`;

const StyledItemLink = styled(Link)`
  font-size: 0.8125rem;
  line-height: 2;
  padding-left: 4px;
  border-left: 3px solid transparent;
  &:hover {
    border-left: 3px solid #c4c4c4;
  }
  ${(props) =>
    props.$isCurrentSection &&
    css`
      color: ${props.theme.palette.info.main};
      border-left: 3px solid #c4c4c4;
    `};
`;

export { TableContainer, StickyNav, TableTitle, StyledItemLink };
