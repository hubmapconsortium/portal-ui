import { createContext, useContext } from 'js/helpers/context';

export interface VizContainerStylingProps {
  isPublicationPage: boolean;
  uuid?: string;
  shouldDisplayHeader: boolean;
}

export const VizContainerStyleContext = createContext<VizContainerStylingProps>(
  'VisualizationContainerStylingContext',
  {
    isPublicationPage: false,
    uuid: '',
    shouldDisplayHeader: false,
  },
);
export const useVizContainerStyles = () => useContext(VizContainerStyleContext);
