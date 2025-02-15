const axios = require('axios');
const domains = require('../domains');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { domain, subdomain } = req.body;
    if (!domains[domain]) {
      return res.status(400).json({ error: 'Domain tidak ditemukan' });
    }
    try {
      // Ambil daftar record untuk mencari ID record yang sesuai
      const recordsResponse = await axios.get(
        `https://api.cloudflare.com/client/v4/zones/${domains[domain].zone}/dns_records`,
        {
          headers: {
            Authorization: `Bearer ${domains[domain].apitoken}`
          }
        }
      );
      const record = recordsResponse.data.result.find(r => r.name === `${subdomain}.${domain}`);
      if (!record) return res.status(404).json({ error: 'Subdomain tidak ditemukan' });
      
      // Hapus record berdasarkan ID
      await axios.delete(
        `https://api.cloudflare.com/client/v4/zones/${domains[domain].zone}/dns_records/${record.id}`,
        {
          headers: {
            Authorization: `Bearer ${domains[domain].apitoken}`
          }
        }
      );
      
      res.status(200).json({ success: true, message: 'Subdomain dihapus' });
    } catch (error) {
      res.status(500).json({ error: error.response?.data || error.message });
    }
  } else {
    res.status(405).end();
  }
};
