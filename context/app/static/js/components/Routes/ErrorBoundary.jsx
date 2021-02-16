import React from 'react';
import Error from 'js/pages/Error';
import ReactGA from 'react-ga';

function sendError(errorString) {
  ReactGA.event({
    category: 'Client Error',
    action: 'Routes Error Boundary',
    label: errorString,
    nonInteraction: true,
  });
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    sendError(String(error));
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;

    if (hasError) {
      return <Error isErrorBoundary errorBoundaryMessage={String(error)} />;
    }
    const { children } = this.props;
    return children;
  }
}

export default ErrorBoundary;
