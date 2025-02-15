export default async function handler(req, res) {
  const { text } = req.query;
  if (!text) {
    res.status(400).json({ error: "Parameter 'text' diperlukan" });
    return;
  }
  
  // Opsional: Validasi panjang teks (misalnya maksimal 200 karakter)
  if (text.length > 200) {
    res.status(400).json({ error: "Teks terlalu panjang. Maksimal 200 karakter." });
    return;
  }
  
  try {
    // Encode teks dengan benar
    const encodedText = encodeURIComponent(text.trim());
    
    // Buat URL untuk API eksternal dengan isVideo=false agar mengembalikan gambar
    const externalUrl = `https://fgsi-brat.hf.space/?text=${encodedText}&isVideo=false`;
    console.log("Fetching:", externalUrl);
    
    const response = await fetch(externalUrl);
    if (!response.ok) {
      throw new Error("Gagal mengambil dari API eksternal");
    }
    
    // Ambil header content-type dari respons
    const contentType = response.headers.get("content-type") || "image/webp";
    res.setHeader("Content-Type", contentType);
    
    // Ambil data sebagai ArrayBuffer dan kirimkan sebagai Buffer
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Error dalam proxy:", error);
    res.status(500).json({ error: "Gagal memproses request" });
  }
}
