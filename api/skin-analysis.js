export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Node.js 환경에서 가장 안정적인 표준 FormData 바이너리 조립
        const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
        const header = Buffer.from(
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="image"; filename="face.jpg"\r\n` +
            `Content-Type: image/jpeg\r\n\r\n`
        );
        const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
        const multipartBody = Buffer.concat([header, imageBuffer, footer]);

        const apiResponse = await fetch('https://ailabapi.com', {
            method: 'POST',
            headers: {
                'ailabapi-api-key': 'Gd9dFuZABqfXR97R5575Nx99Nex5a8l4bYmsaIy8JlrIUaW1y7j6CGrMJQhfNzZx',
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: multipartBody
        });

        const data = await apiResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'AI Analysis Server Error', details: error.message });
    }
}
