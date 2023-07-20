import styled from 'styled-components';
import SvgIcon from '@material-ui/core/SvgIcon';
import { TabPanel, Tabs } from 'js/shared-styles/tabs';
import { Alert } from 'js/shared-styles/alerts';

const StyledTabPanel = styled(TabPanel)`
  ${(props) => props.value === props.index && `flex-grow: 1`};
  display: flex;
  min-height: 0px; // flex overflow fix
  align-items: center;
`;

const StyledTabs = styled(Tabs)`
  flex: none;
`;

const StyledAlert = styled(Alert)`
  margin: 10px;
  flex-grow: 1;
`;

const StyledSvgIcon = styled(SvgIcon)`
  font-size: 1.25rem;
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const EntityHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
  border: red 2px solid;
`;

export { StyledTabPanel, StyledTabs, StyledAlert, StyledSvgIcon, EntityHeader };
