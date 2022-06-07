import { useState, useCallback } from 'react';

function useQueryBody() {
  const [queryBody, setQueryBody] = useState(undefined);

  const setQueryBodyAndReturnBody = useCallback(
    (body) => {
      setQueryBody(body);
      return body;
    },
    [setQueryBody],
  );

  return { queryBody, setQueryBodyAndReturnBody };
}

export { useQueryBody };
