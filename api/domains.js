const domains = require('../domains');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    res.status(200).json(Object.keys(domains));
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
