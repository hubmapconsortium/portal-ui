import { styled } from '@mui/material/styles';

import { PanelScrollBox } from 'js/shared-styles/panels';

const SeparatedFlexRow = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
}));

const FlexBottom = styled('div')({
  display: 'flex',
  alignItems: 'flex-end',
});

const MaxHeightScrollbox = styled(PanelScrollBox)({
  maxHeight: '415px',
});

export { SeparatedFlexRow, FlexBottom, MaxHeightScrollbox };
