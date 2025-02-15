const domains = require('../domains');

module.exports = (req, res) => {
  console.log('Request method:', req.method);
  if (req.method === 'GET') {
    res.status(200).json(Object.keys(domains));
  } else {
    res.status(405).end();
  }
};
