const vitessce = jest.mock('vitessce');

vitessce.decodeURLParamsToConf = () => {
  return { name: 'conf1', attr: 'bar' };
};

module.exports = vitessce;
