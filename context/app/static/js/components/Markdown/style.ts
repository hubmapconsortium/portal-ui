import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  padding: theme.spacing(4, 5),
  a: {
    color: theme.palette.common.link,
  },
  img: {
    maxWidth: '100%',
  },
  table: {
    borderSpacing: 0,
    borderCollapse: 'collapse',
    overflow: 'scroll',
    display: 'block',
  },
  'th, td': {
    border: '1px solid grey',
    padding: '0.25em 0.5em',
  },
  blockquote: {
    borderLeft: '4px solid grey',
    marginLeft: 0,
    paddingLeft: '1em',
  },
  li: {
    listStyle: 'square',
  },
  h1: {
    fontSize: '2.3rem',
    fontWeight: 300,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 300,
    lineHeight: 1.167,
  },
  h3: {
    fontSize: '1.6rem',
    fontWeight: 300,
    lineHeight: 1.235,
  },
  h4: {
    fontSize: '1.3rem',
    fontWeight: 300,
    lineHeight: 1.334,
  },
  h5: {
    fontSize: '1rem',
    fontWeight: 300,
    lineHeight: 1.6,
  },
  details: {
    marginLeft: '2em',
    summary: {
      marginLeft: '-2em',
    },
  },
}));

export { StyledPaper };
