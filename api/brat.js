export default async function handler(req, res) {
  const { text } = req.query;
  
  if (!text) {
    res.status(400).json({ error: "Parameter 'text' diperlukan" });
    return;
  }
  
  // Validasi panjang teks (misalnya maksimal 200 karakter)
  if (text.length > 200) {
    res.status(400).json({ error: "Teks terlalu panjang. Maksimal 200 karakter." });
    return;
  }
  
  // Mengganti spasi dengan tanda dash (-)
  // Misalnya, "halo bang" akan menjadi "halo-bang"
  const formattedText = text.trim().split(/\s+/).join('-');
  
  try {
    const externalUrl = `https://fgsi-brat.hf.space/?text=${formattedText}&isVideo=false`;
    console.log("Fetching:", externalUrl);
    
    const response = await fetch(externalUrl);
    if (!response.ok) {
      throw new Error("Gagal mengambil dari API eksternal");
    }
    
    // Ambil content-type dari respons, default ke image/webp
    const contentType = response.headers.get("content-type") || "image/webp";
    res.setHeader("Content-Type", contentType);
    
    // Kirim data sebagai Buffer
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Gagal memproses request" });
  }
}
