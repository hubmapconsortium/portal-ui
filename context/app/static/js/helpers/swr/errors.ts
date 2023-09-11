interface SWRErrorInfo {
  info: object;
  status: number;
}

class SWRError extends Error {
  public info: object;

  public status: number;

  constructor(message: string, { info, status }: SWRErrorInfo) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

export { SWRError };
