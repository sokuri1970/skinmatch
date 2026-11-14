const AILAB_URL = "https://www.ailabapi.com/api/portrait/analysis/skin-analysis";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ hasKey: !!process.env.AILAB_API_KEY });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error_msg: "POST only" });
  }

  const key = process.env.AILAB_API_KEY;
  if (!key) {
    return res.status(500).json({ error_msg: "서버에 API 키가 설정되지 않았습니다." });
  }

  try {
    const { image } = req.body || {};
    if (!image) {
      return res.status(400).json({ error_msg: "사진 데이터가 없습니다." });
    }

    const base64 = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");

    const form = new FormData();
    const fieldName = process.env.AILAB_FIELD || "image";
    form.append(fieldName, new Blob([buffer], { type: "image/jpeg" }), "skin.jpg");

    const upstream = await fetch(AILAB_URL, {
      method: "POST",
      headers: { "ailabapi-api-key": key },
      body: form
    });

    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error_msg: "AILabTools 응답 해석 실패: " + text.slice(0, 200) };
    }
    return res.status(upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ error_msg: "서버 오류: " + err.message });
  }
}
