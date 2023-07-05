import React from 'react';

import { DetailPageSection } from 'js/components/detailPage/style';
import { SpacedSectionButtonRow } from 'js/shared-styles/sections/SectionButtonRow';
import { StyledSectionHeader } from '../Visualization/style';
import { VisualizationErrorBoundaryBackground } from './style';

// consider using "react-error-boundary" package in the future to convert this to a functional component
class VisualizationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
    this.setState({
      hasError: true,
      error: { error, errorInfo },
    });
  }

  render() {
    const { hasError, error } = this.state;
    const { isPublicationPage, uuid, shouldDisplayHeader, children } = this.props;

    if (hasError) {
      return (
        <DetailPageSection id={isPublicationPage ? `visualization-${uuid}` : 'visualization'}>
          <SpacedSectionButtonRow
            leftText={shouldDisplayHeader ? <StyledSectionHeader>Visualization</StyledSectionHeader> : undefined}
          />
          <VisualizationErrorBoundaryBackground>
            <div>The Vitessce visualization encountered an error. Please try again or contact support.</div>
            <details>
              <summary>Click to expand error details</summary>
              <div>{error.errorInfo.componentStack}</div>
            </details>
          </VisualizationErrorBoundaryBackground>
        </DetailPageSection>
      );
    }

    return children;
  }
}

export default VisualizationErrorBoundary;
