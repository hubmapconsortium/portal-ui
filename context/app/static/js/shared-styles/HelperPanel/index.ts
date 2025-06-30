import HelperPanel, { HelperPanelBodyItem, HelperPanelHeader } from './HelperPanel';

import { HelperPanelButton } from './styles';

type HelperPanelType = typeof HelperPanel & {
  BodyItem: typeof HelperPanelBodyItem;
  Header: typeof HelperPanelHeader;
  Button: typeof HelperPanelButton;
};

const ExtendedHelperPanel = HelperPanel as HelperPanelType;
ExtendedHelperPanel.BodyItem = HelperPanelBodyItem;
ExtendedHelperPanel.Header = HelperPanelHeader;
ExtendedHelperPanel.Button = HelperPanelButton;

export default ExtendedHelperPanel;
