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
        const buffer = Buffer.from(base64Data, 'base64');

        const formData = new FormData();
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        formData.append('image', blob, 'face.jpg');

        const apiResponse = await fetch('https://ailabapi.com', {
            method: 'POST',
            headers: {
                'ailabapi-api-key': 'Gd9dFuZABqfXR97R5575Nx99Nex5a8l4bYmsaIy8JlrIUaW1y7j6CGrMJQhfNzZx'
            },
            body: formData
        });

        const data = await apiResponse.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'AI Analysis Server Error', details: error.message });
    }
}
