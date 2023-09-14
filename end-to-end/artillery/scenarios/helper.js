/* eslint-disable no-console */
function printStatus(requestParams, response, context, ee, next) {
  const { statusCode, body, request } = response;
  const { method, uri, headers } = request;
  console.log(
    `${method} ${uri.path} [${
      "range" in headers ? headers.range : ""
    }]: ${statusCode}`
  );
  // ${body.slice(0, 50)}
  return next();
}

module.exports = {
  printStatus,
};
