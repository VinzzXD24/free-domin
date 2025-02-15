// api/create-subdomain.js
const axios = require("axios");

// Konfigurasi domain diambil dari environment variables (diatur melalui dashboard Vercel)
const globalSubdomain = {
  [process.env.DOMAIN_1]: {
    zone: process.env.ZONE_1,
    apitoken: process.env.TOKEN_1,
  },
  [process.env.DOMAIN_2]: {
    zone: process.env.ZONE_2,
    apitoken: process.env.TOKEN_2,
  },
  // Tambahkan domain lainnya sesuai kebutuhan...
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { domain, host, ip } = req.body;
  if (!domain || !host || !ip) {
    return res.status(400).json({ error: "Field tidak lengkap!" });
  }
  if (!globalSubdomain[domain]) {
    return res.status(400).json({ error: "Domain tidak ditemukan!" });
  }

  const config = globalSubdomain[domain];
  const zone = config.zone;
  const apitoken = config.apitoken;

  // Sanitasi input
  const cleanHost = host.replace(/[^a-z0-9.-]/gi, "");
  const subdomainName = `${cleanHost}.${domain}`;
  const cleanIP = ip.replace(/[^0-9.]/gi, "");

  // Payload untuk API Cloudflare
  const payload = {
    type: "A",
    name: subdomainName,
    content: cleanIP,
    ttl: 3600,
    proxied: false,
  };

  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${zone}/dns_records`,
      payload,
      {
        headers: {
          "Authorization": `Bearer ${apitoken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    if (data.success) {
      res.status(200).json({
        success: true,
        subdomain: data.result.name,
        ip: data.result.content,
      });
    } else {
      res.status(500).json({ success: false, error: data.errors });
    }
  } catch (error) {
    let errMsg =
      error.response && error.response.data
        ? JSON.stringify(error.response.data)
        : error.message;
    res.status(500).json({ success: false, error: errMsg });
  }
};
