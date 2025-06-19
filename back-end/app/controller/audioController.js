import req from "express/lib/request.js";
import * as fs from 'fs';

export async function getTrack(req, res) {
    const filePath = req.body.filePath;
    if (!filePath) {
        return res.status(400).json({})
    }
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Audio file not found' });
    }
    res.setHeader('Content-Type', 'audio/mpeg'); // or audio/wav, audio/ogg, etc.
    res.setHeader('Accept-Ranges', 'bytes'); // Enable range requests for seeking
    res.sendFile(filePath);
}