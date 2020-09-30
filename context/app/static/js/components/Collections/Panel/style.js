import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const Link = styled.a`
  text-decoration: inherit;
  color: inherit;
`;

const PanelWrapper = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: rgb(0, 0, 0, 0.08);
  }
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Name = styled(Typography)`
  word-wrap: break-word;
`;

export { Link, PanelWrapper, Name };
