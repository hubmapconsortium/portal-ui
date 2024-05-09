interface SWRErrorInfo {
  url: string;
  info: object;
  status: number;
}

class SWRError extends Error {
  public info: object;

  public status: number;

  public url: string;

  constructor(message: string, { info, status, url }: SWRErrorInfo) {
    super(message);
    this.url = url;
    this.info = info;
    this.status = status;
  }
}

export { SWRError };
