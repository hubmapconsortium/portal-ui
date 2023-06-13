import { Button } from '@material-ui/core';
import styled from 'styled-components';

export const PageSectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing(1)}px;
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing(3)}px;
`;

export const OrganTilesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-items: stretch;
  align-items: stretch;
  gap: ${(props) => props.theme.spacing(5)}px;
  row-gap: ${(props) => props.theme.spacing(2)}px;
  & > * {
    flex: 1 1 0;
    display: flex;
    align-items: stretch;
    & > * {
      flex: 1 1 0;
    }
  }
`;

export const ResetOrganFiltersButton = styled(Button)`
  margin-left: auto;
  width: max-content;
  flex: 0 0 auto;
  background-color: ${(props) => props.theme.palette.primary.main};
  color: #fff;
  border-radius: 4px;
`;