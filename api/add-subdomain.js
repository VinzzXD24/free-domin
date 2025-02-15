const axios = require('axios');
const domains = require('../domains');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { domain, subdomain, ip } = req.body;
    if (!domains[domain]) {
      return res.status(400).json({ error: 'Domain tidak ditemukan' });
    }
    try {
      const response = await axios.post(
        `https://api.cloudflare.com/client/v4/zones/${domains[domain].zone}/dns_records`,
        {
          type: "A",
          name: `${subdomain}.${domain}`,
          content: ip,
          ttl: 1,
          proxied: false
        },
        {
          headers: {
            Authorization: `Bearer ${domains[domain].apitoken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.response?.data || error.message });
    }
  } else {
    res.status(405).end();
  }
};
