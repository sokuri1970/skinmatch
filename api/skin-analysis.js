export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const key = process.env.AILAB_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "server key missing" });
  }

  try {
    // 요청 본문(multipart)을 그대로 AILabTools로 전달
    const upstream = await fetch(
      "https://www.ailabapi.com/api/portrait/analysis/skin-analysis",
      {
        method: "POST",
        headers: {
          "ailabapi-api-key": key,
          "Content-Type": req.headers["content-type"]
        },
        body: req,
        duplex: "half"
      }
    );
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error: "upstream failed" });
  }
}
