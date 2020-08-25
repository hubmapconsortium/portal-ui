/* eslint-disable no-console */
function printStatus(requestParams, response, context, ee, next) {
  const { method, uri } = response.request;
  console.log(`${method} ${uri.path}: ${response.statusCode} ${response.body.slice(0, 100)}`);
  // console.log(response.request.body);
  return next();
}

module.exports = {
  printStatus,
};
