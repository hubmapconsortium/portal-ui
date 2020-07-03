import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      return (
        <Container>
          <Paper>
            <h1>Error</h1>
            <p>
              Please provide this information to{' '}
              <a href="mailto:help@hubmapconsortium.org">help@hubmapconsortium.org</a>:
            </p>
            <p>URL: {String(document.location)}</p>
            <p>Error: {String(error)}</p>
          </Paper>
        </Container>
      );
    }
    const { children } = this.props;
    return children;
  }
}

export default ErrorBoundary;
