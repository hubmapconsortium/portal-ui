import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';

const FlexContainer = styled('div')({
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'space-between',
  flexWrap: 'wrap',
});

const FlexColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

// 300 = size of tile
const TableColumn = styled('div')({
  minWidth: '300px',
});

const StyledSvgIcon = styled(SvgIcon)(({ theme }) => ({
  fontSize: '1.25rem',
  marginRight: theme.spacing(1.5),
}));

const ProvTableEntityHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

export { FlexContainer, FlexColumn, TableColumn, StyledSvgIcon, ProvTableEntityHeader };
