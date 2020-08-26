/* eslint-disable no-console */
function printStatus(requestParams, response, context, ee, next) {
    const { statusCode, body, request } = response;
  const { method, uri } = request;
  console.log(`${method} ${uri.path}: ${statusCode} ${body.slice(0, 50)}`);
  // console.log(response.request.body);
  return next();
}

module.exports = {
  printStatus,
};
