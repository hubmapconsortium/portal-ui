// Copied from https://www.searchkit.co/docs/reference/searchkit-sdk#network-transport
// Modified to handle our elasticsearch url
class RequestTransporter {
  constructor(config, abortController) {
    this.config = config;
    this.abortController = abortController;
  }

  async performRequest(requestBody) {
    const response = await fetch(this.config.host, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { ...this.config.connectionOptions.headers, 'content-type': 'application/json' },
      signal: this.abortController.signal,
    });
    const json = await response.json();
    return json;
  }
}

export default RequestTransporter;
