import { styled } from '@mui/material/styles';

export const CheckList = styled('ul')(({ theme }) => ({
  '& li': {
    listStyleImage: `url(data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%20-6%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M8.79506%2016.375L5.32506%2012.905C5.13823%2012.7178%204.88458%2012.6125%204.62006%2012.6125C4.35554%2012.6125%204.10189%2012.7178%203.91506%2012.905C3.52506%2013.295%203.52506%2013.925%203.91506%2014.315L8.09506%2018.495C8.48506%2018.885%209.11506%2018.885%209.50506%2018.495L20.0851%207.91501C20.4751%207.52501%2020.4751%206.89501%2020.0851%206.50501C19.8982%206.31776%2019.6446%206.21252%2019.3801%206.21252C19.1155%206.21252%2018.8619%206.31776%2018.6751%206.50501L8.79506%2016.375Z%22%20fill%3D%22${encodeURIComponent(theme.palette.success.main)}%22%2F%3E%3C%2Fsvg%3E)`,
    listStylePosition: 'outside',
    '&::marker': {
      width: '1em',
      height: '1em',
    },
  },
}));

export const StyledImg = styled('img')({
  aspectRatio: '3 / 4',
});
