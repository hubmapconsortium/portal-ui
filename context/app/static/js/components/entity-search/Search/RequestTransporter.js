// https://www.searchkit.co/docs/reference/searchkit-sdk#network-transport
class RequestTransporter {
  constructor(config) {
    this.config = config;
  }

  async performRequest(requestBody) {
    const response = await fetch(this.config.host, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: { ...this.config.connectionOptions.headers, 'content-type': 'application/json' },
    });
    const json = await response.json();
    return json;
  }
}

export default RequestTransporter;
