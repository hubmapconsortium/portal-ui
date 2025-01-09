interface UkvAPIFailure {
  success: false;
  message: string;
  data: undefined;
}

interface UkvAPISuccess<Data> {
  success: true;
  message: string;
  data: Data;
}

type UkvAPIResponse<Data> = UkvAPIFailure | UkvAPISuccess<Data>;

type UkvAPIResponseWithoutData = Omit<UkvAPIResponse<undefined>, 'data'>;

export type { UkvAPIResponse, UkvAPIResponseWithoutData };
