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
  
  // Mengganti spasi dengan tanda plus
  const encodedText = text.trim().split(/\s+/).join('+');
  
  try {
    const externalUrl = `https://fgsi-brat.hf.space/?text=${encodedText}&isVideo=false`;
    console.log("Fetching:", externalUrl);
    
    const response = await fetch(externalUrl);
    if (!response.ok) {
      throw new Error("Gagal mengambil dari API eksternal");
    }
    
    const contentType = response.headers.get("content-type") || "image/webp";
    res.setHeader("Content-Type", contentType);
    
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Gagal memproses request" });
  }
}
